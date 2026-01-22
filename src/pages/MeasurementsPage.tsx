import { SearchWebsite } from '@/components/ui/search-website'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Bundle from '@/components/Measurement/Bundle'
import BundleOverheadCTA from '@/components/Measurement/BundleOverheadCTA'
import ConvertImagesCTA from '@/components/Measurement/ConvertImagesCTA'
import Environments from '@/components/Measurement/Environments'
import { LoadingMeasurement } from '@/components/Measurement/Loading'
import Pricetag from '@/components/Pricetag'
import AutoProgress from '@/components/ui/auto-progress'
import { Button } from '@/components/ui/button'
import PreloadImage from '@/components/ui/preload-image-cover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import StarRating from '@/components/ui/StarRating'
import { useCreateMeasure } from '@/hooks/useCreateMeasure'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { toHeaderCase } from 'js-convert-case'
import {
  ChartLine,
  Clock,
  EyeOff,
  FileWarning,
  Plus,
  Repeat,
  Sparkles,
} from 'lucide-react'
import moment from 'moment'
import { useLocation, useNavigate, useParams } from 'react-router'
import {
  ConnectionType,
  DeviceType,
  MeasurementStatus,
  useMeasurementDevicesQuery,
  useMeasurementsLazyQuery,
  useWebsiteQuery,
  type Measurement,
  type WebsiteHost,
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MeasurementsPageProps {}

const MeasurementsPage: React.FC<MeasurementsPageProps> = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const params = useParams<{ host: string }>()
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const selectedPath = searchParams.get('path') || '/'
  const url = useMemo(
    () => new URL(selectedPath ?? '/', `https://${params.host}`).href,
    [selectedPath, params.host],
  )

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const { data: measurementDevicesData } = useMeasurementDevicesQuery()
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType>(
    ConnectionType.Wifi,
  )

  useEffect(() => {
    if (!selectedDevice && measurementDevicesData?.measurementDevices?.length) {
      setSelectedDevice(
        measurementDevicesData.measurementDevices[0]?.id || null,
      )
    }
  }, [measurementDevicesData, selectedDevice])

  const [
    measurementsQuery,
    { data: measurementsQueryData, startPolling, stopPolling },
  ] = useMeasurementsLazyQuery({ fetchPolicy: 'network-only' })
  const {
    createMeasure,
    data: createMeasurementData,
    error: createMeasureError,
    setError,
    isPaying,
  } = useCreateMeasure({
    url,
  })

  useEffect(() => {
    if (
      createMeasurementData?.createMeasurement &&
      new URL(createMeasurementData.createMeasurement.url).host === params.host
    ) {
      const newMeasurement = createMeasurementData?.createMeasurement
      const newUrlObj = new URL(newMeasurement?.url || url)
      navigate(
        `/measurements/${newUrlObj.hostname}?path=${
          newUrlObj.pathname
        }&device=${
          measurementDevicesData?.measurementDevices?.find(
            (d) => d.id === selectedDevice,
          )?.type
        }&connection=${selectedConnection}`,
        { replace: true },
      )
    }
  }, [
    createMeasurementData?.createMeasurement,
    measurementDevicesData?.measurementDevices,
    navigate,
    params.host,
    selectedConnection,
    selectedDevice,
    url,
  ])

  const completedMeasurements = useMemo(() => {
    return (
      measurementsQueryData?.measurements?.filter(
        (m) => m.status === MeasurementStatus.Completed,
      ) || []
    )
  }, [measurementsQueryData?.measurements])

  const measurement = useMemo(() => {
    const device = searchParams.get('device') as DeviceType | null
    const connection = searchParams.get('connection') as ConnectionType | null
    const fullMatch = completedMeasurements
      ?.filter((m) => new URL(m.redirect || m.url).pathname === selectedPath)
      .find((m) => {
        if (
          new URL(m.redirect || m.url).host === params.host &&
          m.connectionType === (connection || ConnectionType.Wifi) &&
          m.device.type === (device || DeviceType.Desktop)
        ) {
          return true
        }
      })
    const partialMatch = completedMeasurements?.find(
      (m) => new URL(m.redirect || m.url).pathname === selectedPath,
    )

    const fallbackMatch = measurementsQueryData?.measurements?.length
      ? measurementsQueryData?.measurements?.find(
          (m) => new URL(m.redirect || m.url).pathname === selectedPath,
        )
      : null
    return fullMatch || partialMatch || fallbackMatch || null
  }, [
    completedMeasurements,
    measurementsQueryData?.measurements,
    params.host,
    searchParams,
    selectedPath,
  ])

  const { data: websiteQueryData } = useWebsiteQuery({
    variables: {
      host: measurement?.redirect
        ? new URL(measurement.redirect).host
        : measurement?.url
          ? new URL(measurement?.url).host!
          : params.host || '',
    },
  })

  const bundle = useMemo(() => {
    if (measurement?.status !== MeasurementStatus.Completed) {
      return null
    }
    return (
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-4 lg:px-6 pb-4 pt-2 gap-6"
      >
        <div className="col-span-4 lg:col-span-3">
          <Bundle measurement={measurement} />
        </div>
        <div className="col-span-4 lg:col-span-1 flex flex-col gap-4">
          {measurement.bundledFiles.find(
            (f) => f.type === 'image/png' || f.url.endsWith('.png'),
          ) &&
            params.host && (
              <ConvertImagesCTA host={params.host} path={selectedPath} />
            )}
          {measurement.bundledFiles.filter((f) => f.type === 'js').length >
            6 && <BundleOverheadCTA />}
        </div>
      </motion.div>
    )
  }, [measurement, params.host, selectedPath])

  useEffect(() => {
    const hasExistingMeasurements = (
      measurements?:
        | (Pick<Measurement, 'url' | 'redirect'> & {
            host?: Pick<WebsiteHost, 'host'> | null
          })[]
        | null,
    ) => {
      return measurements?.some((m) => {
        return (
          new URL(m.redirect || m.url).host === params.host &&
          (!selectedPath ||
            new URL(m.redirect || m.url).pathname === selectedPath)
        )
      })
    }
    if (url && !hasExistingMeasurements(measurementsQueryData?.measurements)) {
      console.debug('Fetching measurements for, because none were found', url)
      measurementsQuery({
        variables: { host: params.host! },
      }).then((data) => {
        if (
          !data.error &&
          (!data.data?.measurements?.length ||
            !hasExistingMeasurements(data.data?.measurements))
        ) {
          navigate(`/measure?url=${encodeURIComponent(url)}`, {
            replace: true,
          })
        }
      })
    }
  }, [
    measurementsQuery,
    measurementsQueryData?.measurements,
    navigate,
    params,
    selectedPath,
    url,
  ])

  const measure = useCallback(
    (device: DeviceType, connection: ConnectionType) => {
      if (url) {
        if (
          !measurementsQueryData?.measurements?.some(
            (m) =>
              new URL(m.url).pathname === selectedPath &&
              m.device.type === device &&
              m.connectionType === connection,
          )
        ) {
          createMeasure({
            url,
            device,
            connection,
          })
        }
      }
    },
    [createMeasure, measurementsQueryData?.measurements, selectedPath, url],
  )

  useEffect(() => {
    if (
      measurementsQueryData?.measurements?.some(
        (m) => m.status === MeasurementStatus.Pending,
      ) &&
      measurement
    ) {
      startPolling(2000)
      return () => {
        stopPolling()
      }
    } else {
      stopPolling()
    }
  }, [
    measurementsQuery,
    params,
    measurementsQueryData?.measurements,
    measurement,
    startPolling,
    stopPolling,
  ])

  const search = useCallback(
    (url: string) => {
      const urlObj = new URL(url)
      url = new URL(urlObj.pathname, `https://${urlObj.host}`).href
      stopPolling()
      navigate(`/measurements/${urlObj.host}?path=` + urlObj.pathname)
    },
    [navigate, stopPolling],
  )

  useEffect(() => {
    const device = searchParams.get('device')
    const connection = searchParams.get('connection') as ConnectionType
    if (device) {
      const deviceObj = measurementDevicesData?.measurementDevices?.find(
        (d) => d.type === (device as DeviceType),
      )
      if (deviceObj) {
        setSelectedDevice(deviceObj.id)
      }
    } else {
      setSelectedDevice(
        measurementDevicesData?.measurementDevices?.find(
          (d) => d.type === DeviceType.Desktop,
        )?.id || null,
      )
    }
    if (connection) {
      setSelectedConnection(connection)
    } else {
      setSelectedConnection(ConnectionType.Wifi)
    }
  }, [measurementDevicesData?.measurementDevices, searchParams])

  const [iconError, setIconError] = useState<boolean>(false)

  const rating = useMemo(() => {
    return websiteQueryData?.website?.ratings?.find(
      (r) => new URL(r.url).pathname === selectedPath,
    )
  }, [selectedPath, websiteQueryData?.website?.ratings])

  useEffect(() => {
    document.title = measurement?.title
      ? `Measurements ${measurement.title}`
      : 'Measurements'
  }, [measurement?.title])

  if (isPaying) {
    return (
      <div className="max-w-full flex flex-col items-center gap-2 my-6 mt-[58px]">
        <div className="text-xl lg:text-2xl animate-pulse m-6 text-muted-foreground text-center overflow-hidden">
          Processing payment...
        </div>
        <AutoProgress />
      </div>
    )
  }

  if (createMeasureError) {
    return (
      <div className="max-w-full flex flex-col items-center gap-2 my-6 mt-[58px]">
        <div className="text-xl lg:text-2xl m-6 text-muted-foreground text-center overflow-hidden">
          There was an error creating the measurement
        </div>
        <p className="text-red-500">
          {(createMeasureError as { message?: string })?.message ||
            'Please try again later or contact support.'}
        </p>
        <Button
          variant="destructive"
          className="text-white mt-6"
          onClick={() => setError(null)}
        >
          Close
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 pb-40 lg:pb-6">
      <SearchWebsite
        type="search"
        prefix="https://"
        size={24}
        initial={url || ''}
        className="hidden lg:flex"
        onSearch={search}
      />
      {measurement?.status === MeasurementStatus.Failed && (
        <p>Measurement failed. Please try again later.</p>
      )}
      {measurement?.status === MeasurementStatus.Pending ? (
        <LoadingMeasurement dark />
      ) : null}
      {measurementsQueryData?.measurements
        ?.filter((m) => new URL(m.redirect || m.url).pathname === selectedPath)
        .some((m) => m?.status === MeasurementStatus.Completed) &&
        measurement && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-6 px-2 py-4 lg:p-6">
              <div className="w-full flex flex-col items-center md-items-start lg:flex-row gap-4">
                <motion.div
                  initial={{ scale: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 2, type: 'spring' }}
                  className="h-fit w-full lg:w-fit border rounded-lg"
                >
                  <PreloadImage
                    src={measurement.thumbnail}
                    onClick={() =>
                      navigate(
                        `/measurements/${params.host}/thumbnail?path=${selectedPath}`,
                      )
                    }
                    className="cursor-pointer relative w-full h-48 lg:w-[12rem] lg:h-[calc(148px-1rem)] rounded-sm bg-cover bg-center"
                  >
                    {(error) =>
                      error ? (
                        <div className="w-full h-full bg-gray-400 rounded-sm">
                          <div className="h-full flex flex-col items-center justify-center gap-1 text-gray-300">
                            <EyeOff size={20} /> No thumbnail
                          </div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-white border flex items-center justify-center gap-1 px-2 py-1 rounded-full">
                            <span className="flex items-center gap-1 font-medium">
                              <Sparkles
                                size={16}
                                className="animate-[rainbow-icon_3s_linear_infinite]"
                              />
                              <span className="bg-[linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#06b6d4,#3b82f6,#8b5cf6,#ec4899,#ef4444)] bg-[length:200%_auto] animate-[rainbow_3s_linear_infinite] bg-clip-text text-transparent text-xs">
                                Generate
                              </span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-white border flex items-center justify-center gap-1 px-2 py-1 rounded-full">
                          <span className="flex items-center gap-1 font-medium">
                            <Sparkles
                              size={16}
                              className="animate-[rainbow-icon_3s_linear_infinite]"
                            />
                            <span className="bg-[linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#06b6d4,#3b82f6,#8b5cf6,#ec4899,#ef4444)] bg-[length:200%_auto] animate-[rainbow_3s_linear_infinite] bg-clip-text text-transparent text-xs">
                              Generate
                            </span>
                          </span>
                        </div>
                      )
                    }
                  </PreloadImage>
                </motion.div>
                <motion.div
                  initial={{ translateY: 10, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full flex flex-col gap-2 pt-2 overflow-hidden"
                >
                  <div className="flex gap-4 items-center">
                    {url && measurement && (
                      <div className="w-full flex flex-col">
                        <div className="flex gap-2 items-center">
                          {measurement.icon && !iconError && (
                            <img
                              src={measurement.icon}
                              onError={() => {
                                setIconError(true)
                              }}
                              className="bg-gray-100 p-1 rounded-sm w-6 h-6 bg-cover bg-center bg-no-repeat"
                            />
                          )}
                          <h1 className="max-w-[calc(100%-6rem)] text-xl font-bold lg:max-w-md truncate">
                            {measurement?.title}
                          </h1>
                        </div>
                        <div className="max-w-xl text-md text-muted-foreground">
                          {new URL(measurement?.url).hostname}
                          {measurement.redirect &&
                            ' → ' + new URL(measurement.redirect).hostname}
                        </div>
                      </div>
                    )}
                  </div>
                  {measurement.description ? (
                    <div className="max-w-sm text-sm line-clamp-3">
                      {measurement?.description}
                    </div>
                  ) : (
                    <div className="text-red-500">
                      No description available.
                    </div>
                  )}
                </motion.div>
              </div>
              <motion.div
                initial={{ position: 'relative', left: '100%' }}
                animate={{ left: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex flex-col items-center lg:items-end gap-2 pt-2"
              >
                {!(
                  searchParams.get('device') === DeviceType.Desktop &&
                  selectedConnection === ConnectionType.Wifi
                ) && <Pricetag />}
                <Button
                  className="flex gap-2"
                  variant="outline"
                  onClick={() => {
                    if (selectedDevice && selectedConnection) {
                      const device =
                        measurementDevicesData?.measurementDevices?.find(
                          (d) => d.id === selectedDevice,
                        )?.type
                      if (!device) return
                      createMeasure({
                        url,
                        device,
                        connection: selectedConnection,
                      })
                    }
                  }}
                >
                  <Repeat size={16} /> Re-measure
                </Button>
                <div className="flex gap-2 mb-4">
                  <Select
                    onValueChange={(value) => setSelectedDevice(value)}
                    defaultValue={selectedDevice || undefined}
                  >
                    <SelectTrigger className="w-fit">
                      {toHeaderCase(
                        measurementDevicesData?.measurementDevices?.find(
                          (device) => device.id === selectedDevice,
                        )?.type || 'Select device',
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {measurementDevicesData?.measurementDevices?.map(
                        (device) => (
                          <SelectItem value={device.id} key={device.id}>
                            {toHeaderCase(device.type)}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) =>
                      setSelectedConnection(value as ConnectionType)
                    }
                    defaultValue={selectedConnection}
                  >
                    <SelectTrigger className="w-fit">
                      {toHeaderCase(selectedConnection)
                        .replace('3g', '3G')
                        .replace('4g', '4G')
                        .replace('Wifi', 'WiFi')}
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        ConnectionType.Wifi,
                        ConnectionType.Fast_4G,
                        ConnectionType.Slow_4G,
                        ConnectionType.Fast_3G,
                        ConnectionType.Slow_3G,
                        ConnectionType.Offline,
                      ].map((connection) => (
                        <SelectItem value={connection} key={connection}>
                          {toHeaderCase(connection)
                            .replace('3g', '3G')
                            .replace('4g', '4G')
                            .replace('Wifi', 'WiFi')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="lg:px-6 flex flex-col lg:flex-row gap-4 mb-6"
            >
              <div
                className="cursor-pointer w-full lg:w-fit border rounded-md shadow-sm flex flex-col justify-end gap-2 p-4"
                onClick={() =>
                  navigate(
                    '/ratings/' +
                      (measurement.redirect
                        ? new URL(measurement.redirect).host
                        : new URL(measurement.url).host || params.host || '') +
                      `?path=${selectedPath}`,
                  )
                }
              >
                <StarRating rating={rating?.overallScore} />
                <span className="text-xs text-gray-400">
                  {rating
                    ? moment(rating.createdAt).fromNow()
                    : 'Not rated yet'}
                </span>
              </div>
              <div
                className="cursor-pointer w-full lg:w-fit border rounded-md shadow-sm flex flex-col justify-end gap-2 p-4"
                onClick={() =>
                  navigate(
                    '/measurements/' +
                      params.host +
                      '/history' +
                      `?path=${selectedPath}`,
                  )
                }
              >
                <ChartLine size={20} className="text-gray-400" />
                <span className="text-sm text-gray-400">
                  Performance Insights
                </span>
              </div>
              {measurement.bundledFiles.filter(
                (f) =>
                  f.type.includes('png') ||
                  f.url.split('?')[0].toLowerCase().endsWith('.png'),
              ).length > 0 && (
                <div
                  className="cursor-pointer w-full lg:w-fit border rounded-md border-amber-200 bg-amber-500/10 shadow-sm flex flex-col gap-2 p-4"
                  onClick={() =>
                    navigate(
                      '/measurements/' +
                        params.host +
                        '/images' +
                        `?path=${selectedPath}`,
                    )
                  }
                >
                  <FileWarning className="text-amber-500" />
                  <span className="text-sm text-amber-500">
                    Convert large images
                  </span>
                </div>
              )}
            </motion.div>
            <motion.div className="flex gap-2 items-center mt-8 lg:px-6">
              {measurementsQueryData.measurements
                .reduce(
                  (acc, m) => {
                    const path = new URL(m.redirect || m.url).pathname
                    if (!acc.some((item) => item.path === path)) {
                      if (!m.title) return acc
                      acc.push({ path, title: m.title })
                    }
                    return acc
                  },
                  [] as { path: string; title: string }[],
                )
                .reverse()
                .map(({ path, title }, index) => {
                  return (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => {
                        const search = new URLSearchParams(location.search)
                        search.set('path', path)
                        navigate(
                          `/measurements/${params.host}?` + search.toString(),
                          { replace: true },
                        )
                      }}
                      className={cn(
                        'h-24 w-[120px] flex flex-col justify-end border rounded-md px-2 py-2 pt-6',
                        path === selectedPath
                          ? 'border-green-500 shadow-sm'
                          : 'cursor-pointer hover:shadow-md',
                      )}
                    >
                      <p className="text-sm max-w-40 line-clamp-2">{title}</p>
                      <p className="text-xs truncate text-muted-foreground px-1 mt-1">
                        {path}
                      </p>
                    </motion.div>
                  )
                })}
              <div
                onClick={() => {
                  const search = new URLSearchParams(location.search)
                  search.set('url', `https://${measurement.host?.host}/`)
                  navigate(`/measure?` + search.toString())
                }}
                className={cn(
                  'cursor-pointer w-8 h-8 bg-gray-100 shadow-sm hover:shadow-none border rounded-full flex items-center justify-center px-2 py-1 text-muted-foreground',
                )}
              >
                <Plus />
              </div>
            </motion.div>
            {measurement.links.length > 0 && (
              <h3 className="pl-6 text-sm font-bold uppercase text-gray-200 pt-4">
                Analyze next
              </h3>
            )}
            {measurement.links.length ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mt-2 lg:px-6 pb-4 flex gap-1 overflow-x-auto text-sm text-gray-500"
              >
                {measurement.links
                  .filter(
                    (url) =>
                      !measurementsQueryData.measurements?.find(
                        (m) =>
                          new URL(m.url).pathname === new URL(url).pathname,
                      ),
                  )
                  .map((url, index) => (
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      key={url}
                      onClick={() =>
                        createMeasure({
                          url: url,
                          device: DeviceType.Desktop,
                          connection: ConnectionType.Wifi,
                        })
                      }
                      className="cursor-pointer px-3 py-1 border rounded-md whitespace-nowrap hover:shadow-sm"
                    >
                      {new URL(url).pathname}
                    </motion.div>
                  ))}
              </motion.div>
            ) : null}
            <Separator className="mt-4" />
            {measurementsQueryData.measurements && measurement && (
              <Environments
                initial={selectedConnection}
                measurements={measurementsQueryData.measurements.filter(
                  (m) => new URL(m.redirect || m.url).pathname === selectedPath,
                )}
                selectedPath={selectedPath}
                current={measurement}
                onClick={measure}
              />
            )}
            <h3 className="pl-6 text-sm font-bold uppercase text-gray-200">
              Screenshots
            </h3>
            {measurement.screenshots?.length ? (
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5 }}
                className="flex gap-4 px-2 lg:px-7 pb-6 pt-4 overflow-x-auto"
              >
                {measurement.screenshots.map((img, index) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      backgroundImage: `url(${
                        new URL(img, import.meta.env.VITE_SCREENSHOTS_FOLDER)
                          .href
                      })`,
                    }}
                    className="flex-shrink-0 w-60 h-40 bg-gray-100 bg-contain bg-center bg-no-repeat rounded-lg ring ring-gray-200 overflow-hidden"
                  >
                    <div className="relative flex items-center gap-1 w-fit left-1 top-2 border rounded-full bg-background/80 px-2 py-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-sm">
                        {index === measurement.screenshots!.length - 1
                          ? 'Final'
                          : `${img.split('/').pop()?.replace('.webp', '')}s`}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
            <h3 className="pl-6 text-sm font-bold uppercase text-gray-200">
              Bundle
            </h3>
            {bundle}
          </div>
        )}
    </div>
  )
}

export default MeasurementsPage
