import { SearchWebsite } from '@/components/ui/search-website'
import React, { useCallback, useEffect, useMemo } from 'react'

import Bundle from '@/components/Measurement/Bundle'
import Environments from '@/components/Measurement/Environments'
import AutoProgress from '@/components/ui/auto-progress'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import PreloadImage from '@/components/ui/preload-image-cover'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { EyeOff, Repeat } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router'
import {
  ConnectionType,
  DeviceType,
  MeasurementsDocument,
  MeasurementStatus,
  useCreateMeasurementMutation,
  useMeasurementsLazyQuery,
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

  const [measurementsQuery, { data: measurementsQueryData, refetch }] =
    useMeasurementsLazyQuery()
  const [createMeasurement] = useCreateMeasurementMutation({
    refetchQueries: [
      {
        query: MeasurementsDocument,
        variables: {
          url,
        },
      },
    ],
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

  const bundle = useMemo(() => {
    if (measurement?.status !== MeasurementStatus.Completed) {
      return null
    }
    return (
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-4 py-4 gap-6"
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
          createMeasurement({ variables: { url } }).then(() => {
            navigate(`/measurements/${urlObj.host}?path=` + urlObj.pathname)
          })
        } else {
          navigate(`/measurements/${urlObj.host}?path=` + urlObj.pathname)
        }
      })
    },
    [createMeasurement, measurementsQuery, navigate]
  )

  useEffect(() => {
    if (url) {
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
  }, [measurementsQuery, navigate, params, url])

  const measure = useCallback(
    (device: DeviceType, connection: ConnectionType) => {
      if (url) {
        // Create a new measurement if it doesn't exist
        createMeasurement({
          variables: {
            url: url || '',
            device,
            connection,
          },
        })
      }
    },
    [createMeasurement, url]
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
                  className="w-fit border rounded-lg p-2"
                >
                  <PreloadImage
                    src={measurement.thumbnail}
                    className="w-[12rem] h-[7rem] rounded-sm bg-cover bg-center"
                  >
                    {(error) =>
                      error ? (
                        <div className="w-[12rem] h-[7rem] bg-gray-200 rounded-sm">
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
                <Button
                  className="flex gap-2"
                  variant="outline"
                  onClick={() => {
                    createMeasurement({
                      variables: {
                        url,
                        remeasure: true,
                      },
                    })
                  }}
                >
                  <Repeat size={16} /> Re-measure
                </Button>
                <Button className="flex gap-2 bg-gray-900 hover:bg-gray-700">
                  <Icons.twitter className="w-[16px] h-[16px] fill-white" />
                  Share
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Separator />
            </motion.div>
            {measurementsQueryData.measurements && measurement && (
              <Environments
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
                    className="flex gap-4 py-4 px-1 overflow-x-auto"
                  >
                    {measurement.screenshots.map((img) => (
                      <div
                        style={{
                          backgroundImage: `url(${
                            import.meta.env.VITE_SCREENSHOTS_FOLDER
                          }${img})`,
                        }}
                        className="flex-shrink-0 w-60 h-40 bg-gray-100 bg-contain bg-center bg-no-repeat rounded-lg ring ring-gray-200 overflow-hidden"
                      />
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
