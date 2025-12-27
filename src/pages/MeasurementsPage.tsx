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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateMeasure } from '@/hooks/useCreateMeasure'
import { motion } from 'framer-motion'
import { toHeaderCase } from 'js-convert-case'
import { Clock, EyeOff, Repeat, Rocket } from 'lucide-react'
import moment from 'moment'
import { useLocation, useNavigate, useParams } from 'react-router'
import {
  ConnectionType,
  DeviceType,
  MeasurementStatus,
  useMeasurementDevicesQuery,
  useMeasurementsLazyQuery,
  useWebsiteQuery,
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
  const url = useMemo(
    () =>
      new URL(searchParams.get('path') ?? '/', `https://${params.host}`).href,
    [searchParams, params]
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
    useMeasurementsLazyQuery()
  const { createMeasure } = useCreateMeasure({
    url,
  })

  const measurement = useMemo(() => {
    const device = searchParams.get('device') as DeviceType | null
    const connection = searchParams.get('connection') as ConnectionType | null
    return (
      measurementsQueryData?.measurements?.find((m) => {
        const match =
          m.url === url &&
          m.connectionType === (connection || ConnectionType.Wifi) &&
          m.device.type === (device || DeviceType.Desktop)
        if (match && m.status === MeasurementStatus.Completed) {
          return match
        }
      }) ||
      measurementsQueryData?.measurements?.find((m) => {
        return m.url === url && m.status === MeasurementStatus.Completed
      }) ||
      (measurementsQueryData?.measurements?.filter(
        (m) => m.status === MeasurementStatus.Completed
      ).length === 0
        ? measurementsQueryData?.measurements[0]
        : null)
    )
  }, [measurementsQueryData?.measurements, searchParams, url])

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
        className="grid grid-cols-4 gap-6"
      >
        <div className="col-span-3">
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
        variables: { url },
        fetchPolicy: 'network-only',
      }).then((data) => {
        if (!data.error && !data.data?.measurements?.length) {
          navigate(`/measure/?url=${encodeURIComponent(url)}`)
        } else {
          navigate(`/measurements/${urlObj.host}?path=` + urlObj.pathname)
        }
      })
    },
    [measurementsQuery, navigate]
  )

  useEffect(() => {
    if (
      url &&
      !measurementsQueryData?.measurements?.some((m) => m.url === url)
    ) {
      measurementsQuery({
        variables: { url },
        fetchPolicy: 'network-only',
      }).then((data) => {
        if (!data.error && !data.data?.measurements?.length) {
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
    url,
  ])

  const measure = useCallback(
    (device: DeviceType, connection: ConnectionType) => {
      if (url) {
        if (
          !measurementsQueryData?.measurements?.some(
            (m) =>
              m.url === url &&
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
    [createMeasure, measurementsQueryData?.measurements, url]
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
          refetch({ url: measurement.url })
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

  return (
    <div className="p-6">
      <SearchWebsite
        type="search"
        prefix="https://"
        size={24}
        initial={url || ''}
        onSearch={search}
      />
      {measurementsQueryData?.measurements?.filter(
        (m) => m.status === MeasurementStatus.Completed
      ).length === 0 &&
        measurement?.status === MeasurementStatus.Pending && (
          <div className="flex flex-col items-center gap-2 my-6">
            <div className="text-2xl animate-pulse m-6 text-muted-foreground whitespace-nowrap overflow-hidden">
              Measuring website...
            </div>
            <AutoProgress />
          </div>
        )}
      {measurement?.status === MeasurementStatus.Failed && (
        <p>Measurement failed. Please try again later.</p>
      )}
      {measurementsQueryData?.measurements?.some(
        (m) => m?.status === MeasurementStatus.Completed
      ) &&
        measurement && (
          <div>
            <div className="flex justify-between gap-6 p-6">
              <div className="flex gap-4">
                <motion.div
                  initial={{ scale: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 2, type: 'spring' }}
                  className="h-fit w-fit border rounded-lg p-2"
                >
                  <PreloadImage
                    src={measurement.thumbnail}
                    className="w-[12rem] h-[calc(148px-1rem)] rounded-sm bg-cover bg-center"
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
                  className="flex flex-col gap-2 pt-2 overflow-hidden"
                >
                  <div className="flex gap-4 items-center">
                    {url && measurement && (
                      <div className="flex flex-col">
                        <div className="flex gap-2 items-center">
                          {measurement.icon && (
                            <div
                              style={{
                                backgroundImage: `url(${measurement.icon})`,
                              }}
                              className="w-6 h-6 bg-cover bg-center bg-no-repeat"
                            />
                          )}
                          <h1 className="text-xl font-bold max-w-md truncate">
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
                    <div className="max-w-sm text-sm">
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
                className="flex flex-col items-end gap-2 pt-2"
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
                      }).then((createMutation) => {
                        const newMeasurement =
                          createMutation.data?.createMeasurement
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
                          <SelectItem value={device.id}>
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
                        <SelectItem value={connection}>
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
              className="px-6 flex gap-4 mb-6"
            >
              <div
                className="cursor-pointer w-fit border rounded-md shadow-sm flex flex-col gap-1 p-4"
                onClick={() =>
                  navigate(
                    '/ratings/' +
                      (measurement.redirect
                        ? new URL(measurement.redirect).host
                        : new URL(measurement.url).host || params.host || '')
                  )
                }
              >
                <StarRating
                  rating={websiteQueryData?.website?.rating?.overallScore}
                />
                <span className="text-xs text-gray-400">
                  {websiteQueryData?.website?.rating
                    ? moment(
                        websiteQueryData?.website?.rating.createdAt
                      ).fromNow()
                    : 'Not rated yet'}
                </span>
              </div>
              <div className="opacity-50 w-fit border rounded-md flex items-center gap-3 p-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, type: 'spring' }}
                  className="w-fit h-fit p-2 bg-muted rounded-full"
                >
                  <Rocket size={20} />
                </motion.div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-primary">
                    Want to boost visibility for this website?
                  </span>
                  {/* <div className="flex text-sm gap-2">
                    <Pricetag />
                    </div> */}
                  <span className="text-xs text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Separator />
            </motion.div>
            {measurementsQueryData.measurements && measurement && (
              <Environments
                initial={selectedConnection}
                measurements={measurementsQueryData.measurements}
                current={measurement}
                onClick={measure}
              />
            )}
            <Tabs defaultValue="bundle" className="p-6 pt-0">
              <TabsList>
                <TabsTrigger value="bundle">Bundle</TabsTrigger>
                {measurement.screenshots?.length && (
                  <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="bundle">{bundle}</TabsContent>
              <TabsContent value="screenshots">
                {measurement.screenshots?.length && (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-4 p-1 overflow-x-auto"
                  >
                    {measurement.screenshots.map((img, index) => (
                      <div
                        style={{
                          backgroundImage: `url(${
                            new URL(
                              img,
                              import.meta.env.VITE_SCREENSHOTS_FOLDER
                            ).href
                          })`,
                        }}
                        className="flex-shrink-0 w-60 h-40 bg-gray-100 bg-contain bg-center bg-no-repeat rounded-lg ring ring-gray-200 overflow-hidden"
                      >
                        <div className="relative flex items-center gap-1 w-fit left-1 top-2 border rounded-full bg-background/80 px-2 py-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-sm">
                            {index === measurement.screenshots!.length - 1
                              ? 'Final'
                              : `${img
                                  .split('/')
                                  .pop()
                                  ?.replace('.webp', '')}s`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
    </div>
  )
}

export default MeasurementsPage
