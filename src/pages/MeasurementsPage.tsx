import { SearchWebsite } from '@/components/ui/search-website'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Bundle from '@/components/Measurement/Bundle'
import Environments from '@/components/Measurement/Environments'
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
import { ChartLine, Clock, EyeOff, Plus, Repeat } from 'lucide-react'
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
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MeasurementsPageProps {}

const MeasurementsPage: React.FC<MeasurementsPageProps> = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const params = useParams<{ host: string }>()
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )
  const selectedPath = searchParams.get('path') || '/'
  const url = useMemo(
    () => new URL(selectedPath ?? '/', `https://${params.host}`).href,
    [selectedPath, params.host]
  )

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const { data: measurementDevicesData } = useMeasurementDevicesQuery()
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType>(
    ConnectionType.Wifi
  )

  useEffect(() => {
    if (!selectedDevice && measurementDevicesData?.measurementDevices?.length) {
      setSelectedDevice(
        measurementDevicesData.measurementDevices[0]?.id || null
      )
    }
  }, [measurementDevicesData, selectedDevice])

  const [measurementsQuery, { data: measurementsQueryData, refetch }] =
    useMeasurementsLazyQuery({ fetchPolicy: 'network-only' })
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
    if (createMeasurementData?.createMeasurement) {
      const newMeasurement = createMeasurementData?.createMeasurement
      const newUrlObj = new URL(newMeasurement?.url || url)
      navigate(
        `/measurements/${newUrlObj.hostname}?path=${
          newUrlObj.pathname
        }&device=${
          measurementDevicesData?.measurementDevices?.find(
            (d) => d.id === selectedDevice
          )?.type
        }&connection=${selectedConnection}`,
        { replace: true }
      )
    }
  }, [
    createMeasurementData?.createMeasurement,
    measurementDevicesData?.measurementDevices,
    navigate,
    selectedConnection,
    selectedDevice,
    url,
  ])

  const completedMeasurements = useMemo(() => {
    return (
      measurementsQueryData?.measurements?.filter(
        (m) => m.status === MeasurementStatus.Completed
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
      (m) => new URL(m.redirect || m.url).pathname === selectedPath
    )

    const fallbackMatch =
      completedMeasurements.length === 0 &&
      measurementsQueryData?.measurements?.length
        ? measurementsQueryData?.measurements?.find(
            (m) => new URL(m.redirect || m.url).pathname === selectedPath
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
      </motion.div>
    )
  }, [measurement])

  const search = useCallback(
    (url: string) => {
      const urlObj = new URL(url)
      url = new URL(urlObj.pathname, `https://${urlObj.host}`).href
      measurementsQuery({
        variables: { host: params.host! },
      }).then((data) => {
        if (!data.error && !data.data?.measurements?.length) {
          navigate(`/measure/?url=${encodeURIComponent(url)}`)
        } else {
          navigate(`/measurements/${urlObj.host}?path=` + urlObj.pathname)
        }
      })
    },
    [measurementsQuery, navigate, params.host]
  )

  useEffect(() => {
    const hasExistingMeasurements = (
      measurements?: Pick<Measurement, 'url' | 'redirect'>[] | null
    ) => {
      return measurements?.some((m) => {
        return (
          (new URL(m.url).host === params.host &&
            new URL(m.url).pathname === selectedPath) ||
          (m.redirect &&
            new URL(m.redirect).host === params.host &&
            new URL(m.redirect).pathname === selectedPath)
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
          navigate(`/measure/?url=${encodeURIComponent(url)}`, {
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
              m.connectionType === connection
          )
        ) {
          createMeasure({
            device,
            connection,
          })
        }
      }
    },
    [createMeasure, measurementsQueryData?.measurements, selectedPath, url]
  )

  useEffect(() => {
    if (
      measurementsQueryData?.measurements?.some(
        (m) => m.status === MeasurementStatus.Pending
      ) &&
      measurement
    ) {
      const interval = setInterval(() => {
        if (measurement?.url) {
          console.debug('Refetching measurement status for', measurement.url)
          refetch({ host: params.host })
        }
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [
    measurementsQuery,
    params,
    refetch,
    measurementsQueryData?.measurements,
    measurement,
  ])

  useEffect(() => {
    const device = searchParams.get('device')
    const connection = searchParams.get('connection') as ConnectionType
    if (device) {
      const deviceObj = measurementDevicesData?.measurementDevices?.find(
        (d) => d.type === (device as DeviceType)
      )
      if (deviceObj) {
        setSelectedDevice(deviceObj.id)
      }
    } else {
      setSelectedDevice(
        measurementDevicesData?.measurementDevices?.find(
          (d) => d.type === DeviceType.Desktop
        )?.id || null
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
      (r) => new URL(r.url).pathname === selectedPath
    )
  }, [selectedPath, websiteQueryData?.website?.ratings])

  useEffect(() => {
    document.title = measurement?.title
      ? `Measurements | ${measurement.title}`
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
          {(createMeasureError as string) ||
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
                    className="w-full h-48 lg:w-[12rem] lg:h-[calc(148px-1rem)] rounded-sm bg-cover bg-center"
                  >
                    {(error) =>
                      error ? (
                        <div className="w-full h-full bg-gray-200 rounded-sm">
                          <div className="h-full flex flex-col items-center justify-center gap-1 text-red-400">
                            <EyeOff size={20} /> No thumbnail
                          </div>
                        </div>
                      ) : null
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
                      <div className="flex flex-col">
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
                <Pricetag />
                <Button
                  className="flex gap-2"
                  variant="outline"
                  onClick={() => {
                    if (selectedDevice && selectedConnection) {
                      const device =
                        measurementDevicesData?.measurementDevices?.find(
                          (d) => d.id === selectedDevice
                        )?.type
                      if (!device) return
                      createMeasure({
                        device,
                        connection: selectedConnection,
                        remeasure: true,
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
                          (device) => device.id === selectedDevice
                        )?.type || 'Select device'
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {measurementDevicesData?.measurementDevices?.map(
                        (device) => (
                          <SelectItem value={device.id} key={device.id}>
                            {toHeaderCase(device.type)}
                          </SelectItem>
                        )
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
                      `?path=${selectedPath}`
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
                className="cursor-pointer w-full lg:w-fit border rounded-md shadow-sm flex flex-col gap-2 p-4"
                onClick={() =>
                  navigate(
                    '/measurements/' +
                      params.host +
                      '/history' +
                      `?path=${selectedPath}`
                  )
                }
              >
                <ChartLine size={20} className="text-gray-400" />
                <span className="text-sm text-gray-400">
                  Performance Insights
                </span>
              </div>
            </motion.div>
            <motion.div className="flex gap-2 items-center mt-8 lg:px-6">
              {measurementsQueryData.measurements
                .reduce((acc, m) => {
                  const path = new URL(m.redirect || m.url).pathname
                  if (!acc.some((item) => item.path === path)) {
                    if (!m.title) return acc
                    acc.push({ path, title: m.title })
                  }
                  return acc
                }, [] as { path: string; title: string }[])
                .reverse()
                .map(({ path, title }) => {
                  return (
                    <div
                      key={path}
                      onClick={() => {
                        const search = new URLSearchParams(location.search)
                        search.set('path', path)
                        navigate(
                          `/measurements/${params.host}?` + search.toString(),
                          { replace: true }
                        )
                      }}
                      className={cn(
                        'h-24 w-[120px] flex flex-col justify-end border rounded-md px-2 py-2 pt-6',
                        path === selectedPath
                          ? 'border-green-500 shadow-sm'
                          : 'cursor-pointer hover:shadow-md'
                      )}
                    >
                      <p className="text-sm max-w-40 line-clamp-2">{title}</p>
                      <p className="text-xs truncate text-muted-foreground px-1 mt-1">
                        {path}
                      </p>
                    </div>
                  )
                })}
              <div
                onClick={() => {
                  const search = new URLSearchParams(location.search)
                  search.set('url', `https://${measurement.host?.host}/`)
                  navigate(`/measure?` + search.toString())
                }}
                className={cn(
                  'cursor-pointer w-8 h-8 bg-gray-100 shadow-sm hover:shadow-none border rounded-full flex items-center justify-center px-2 py-1 text-muted-foreground'
                )}
              >
                <Plus />
              </div>
            </motion.div>
            <Separator className="mt-4" />
            {measurementsQueryData.measurements && measurement && (
              <Environments
                initial={selectedConnection}
                measurements={measurementsQueryData.measurements.filter(
                  (m) => new URL(m.redirect || m.url).pathname === selectedPath
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
                  <div
                    key={img}
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
                  </div>
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
