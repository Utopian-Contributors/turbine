import React, { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'

import Bundle from '@/components/Measurement/Bundle'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import PerformanceChart from '@/components/ui/performance-chart'
import { getConnectionIcon, getDeviceIcon } from '@/helpers/icons'
import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import { motion } from 'framer-motion'
import { toHeaderCase } from 'js-convert-case'
import { ArrowLeft, Clock } from 'lucide-react'
import moment from 'moment'
import {
  ConnectionType,
  DeviceType,
  MeasurementStatus,
  useMeasurementHistoryQuery,
  type BundledFile,
  type Measurement,
  type MeasurementDevice,
} from '../../generated/graphql'

const createShareLink = (
  host: string,
  path: string,
  improvement: number,
  timeframe: string
) => {
  let text = ''
  if (improvement < 0) {
    text =
      'Since Turbine first analyzed the performance of ' +
      host +
      path +
      ` ${timeframe}` +
      ' it improved by ' +
      Math.abs(improvement).toFixed(2) +
      '%!'
  } else if (improvement) {
    text =
      'Since Turbine first analyzed the performance of ' +
      host +
      path +
      ` ${timeframe}` +
      ' it worsened by ' +
      Math.abs(improvement).toFixed(2) +
      '%!'
  }
  text +=
    '\n\nhttps://turbine.utopian.build/measurements/' +
    host +
    '/history?path=' +
    path
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PathHistoryPageProps {}

const PathHistoryPage: React.FC<PathHistoryPageProps> = () => {
  const params = useParams<{ host: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const search = new URLSearchParams(location.search)

  const { data: measurementsQueryData } = useMeasurementHistoryQuery({
    variables: { host: params.host!, path: search.get('path') ?? '' },
  })

  const hasImproved = useCallback(
    (
      m: Pick<
        Measurement,
        'id' | 'elapsed' | 'largestContentfulPaint' | 'connectionType'
      > & {
        device: Pick<MeasurementDevice, 'type'>
        bundledFiles: Pick<BundledFile, 'size'>[]
      }
    ) => {
      if (!measurementsQueryData?.measurements) return {}
      const similar = measurementsQueryData.measurements.filter(
        (meas) =>
          meas.device.type === m.device.type &&
          meas.connectionType === m.connectionType
      )
      if (similar.length <= 1) return {}

      const mIndex = similar.findIndex((meas) => meas.id === m.id)
      const next = similar.find(
        (meas, index) => meas.id !== m.id && index > mIndex
      )
      if (!next) return {}
      return {
        elapsed: next.elapsed! >= m.elapsed!,
        lcp: next.largestContentfulPaint! >= m.largestContentfulPaint!,
        bundleSize:
          next.bundledFiles.reduce((acc, file) => acc + Number(file.size), 0) >=
          m.bundledFiles.reduce((acc, file) => acc + Number(file.size), 0),
      }
    },
    [measurementsQueryData?.measurements]
  )
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>(
    (search.get('device') as DeviceType) ?? DeviceType.Desktop
  )
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType>(
    (search.get('connection') as ConnectionType) ?? ConnectionType.Wifi
  )
  const selectedMeasurements = useMemo(
    () =>
      measurementsQueryData?.measurements?.filter(
        (m) =>
          m.status === MeasurementStatus.Completed &&
          m.device.type === selectedDevice &&
          m.connectionType === selectedConnection
      ),
    [measurementsQueryData?.measurements, selectedDevice, selectedConnection]
  )
  const latestRangeOfElapsed = useMemo(() => {
    if (
      !selectedMeasurements ||
      selectedMeasurements.length === 0 ||
      selectedMeasurements.filter((m) => m.elapsed !== null).length <= 1
    ) {
      return null
    }
    const all = selectedMeasurements.filter((m) => m.elapsed !== null)
    return [all[0].elapsed, all[all.length - 1].elapsed] as number[]
  }, [selectedMeasurements])
  const latestRangeOfBundleSize = useMemo(() => {
    if (
      !selectedMeasurements ||
      selectedMeasurements.length === 0 ||
      selectedMeasurements.filter((m) => m.bundledFiles.length > 0).length <= 1
    ) {
      return null
    }
    const all = selectedMeasurements.filter((m) => m.bundledFiles.length > 0)
    return [
      all[0].bundledFiles.reduce((acc, file) => acc + Number(file.size), 0),
      all[all.length - 1].bundledFiles.reduce(
        (acc, file) => acc + Number(file.size),
        0
      ),
    ] as number[]
  }, [selectedMeasurements])
  const rangeOfLcp = useMemo(() => {
    if (
      !selectedMeasurements ||
      selectedMeasurements.length === 0 ||
      selectedMeasurements.filter((m) => m.largestContentfulPaint !== null)
        .length <= 1
    ) {
      return null
    }
    const all = selectedMeasurements.filter(
      (m) => m.largestContentfulPaint !== null
    )
    return [
      all[0].largestContentfulPaint,
      all[all.length - 1].largestContentfulPaint,
    ] as number[]
  }, [selectedMeasurements])
  const improvements = useMemo(
    () =>
      latestRangeOfElapsed || latestRangeOfBundleSize || rangeOfLcp
        ? {
            elapsed: latestRangeOfElapsed
              ? 100 - (latestRangeOfElapsed[1] / latestRangeOfElapsed[0]) * 100
              : undefined,
            bundleSize: latestRangeOfBundleSize
              ? 100 -
                (latestRangeOfBundleSize[1] / latestRangeOfBundleSize[0]) * 100
              : undefined,
            lcp: rangeOfLcp
              ? 100 - (rangeOfLcp[1] / rangeOfLcp[0]) * 100
              : undefined,
          }
        : undefined,
    [latestRangeOfBundleSize, latestRangeOfElapsed, rangeOfLcp]
  )

  return (
    <div className="w-full lg:w-4xl mx-auto p-6">
      <div className="flex justify-between">
        <div
          className="group cursor-pointer flex items-center gap-2 mb-4"
          onClick={() => {
            navigate(
              '/measurements/' + params.host + '?path=' + search.get('path')
            )
          }}
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
          <span className="group-hover:underline text-md text-muted-foreground">
            Back to Measurements
          </span>
        </div>

        <Button
          className="flex gap-2 bg-black hover:bg-gray-800 text-white"
          disabled={
            !selectedMeasurements ||
            selectedMeasurements.length <= 1 ||
            !improvements
          }
          onClick={() => {
            if (
              !selectedMeasurements ||
              selectedMeasurements.length <= 1 ||
              !improvements
            )
              return
            window.open(
              createShareLink(
                params.host!,
                search.get('path')!,
                Math.round(
                  (improvements.elapsed || 0) +
                    (improvements.bundleSize || 0) +
                    (improvements.lcp || 0)
                ) /
                  [
                    latestRangeOfElapsed,
                    latestRangeOfBundleSize,
                    rangeOfLcp,
                  ].filter(Boolean).length,
                moment(
                  selectedMeasurements[selectedMeasurements.length - 1]
                    .createdAt
                ).from(moment(selectedMeasurements[0].createdAt))
              ),
              '_blank'
            )
          }}
        >
          <Icons.twitter className="h-4 w-4 fill-white" />
          Share
        </Button>
      </div>
      <h1 className="text-4xl font-light">Performance History</h1>
      <p className="text-xl text-gray-400 mb-8">
        {params.host}
        {search.get('path')}
      </p>
      <PerformanceChart
        selectedDevice={selectedDevice}
        selectedConnection={selectedConnection}
        onDeviceChange={(type) => {
          setSelectedDevice(type)
          const newParams = new URLSearchParams(location.search)
          newParams.set('device', type)
          navigate(
            `/measurements/${params.host}/history?${newParams.toString()}`,
            { replace: true }
          )
        }}
        onConnectionChange={(type) => {
          setSelectedConnection(type)
          const newParams = new URLSearchParams(location.search)
          newParams.set('connection', type)
          navigate(
            `/measurements/${params.host}/history?${newParams.toString()}`,
            { replace: true }
          )
        }}
        timeframe={
          selectedMeasurements && selectedMeasurements?.length > 1
            ? moment(
                selectedMeasurements[selectedMeasurements.length - 1].createdAt
              ).from(moment(selectedMeasurements[0].createdAt), true)
            : undefined
        }
        performanceImprovements={improvements}
        data={
          measurementsQueryData?.measurements
            ?.filter(
              (m) =>
                m.status === MeasurementStatus.Completed &&
                m.device.type === selectedDevice &&
                m.connectionType === selectedConnection
            )
            .reverse()
            .map((m) => ({
              time: m.createdAt,
              elapsed: m.elapsed ? m.elapsed * 1_000 : null,
              bundleSize: m.bundledFiles.reduce(
                (acc, file) => acc + Number(file.size),
                0
              ),
              largestContentfulPaint: m.largestContentfulPaint
                ? m.largestContentfulPaint * 1_000
                : null,
            })) ?? []
        }
      />
      <h3 className="text-gray-200 uppercase mt-6">Measurements</h3>
      <Accordion type="multiple" className="flex flex-col px-1">
        {measurementsQueryData?.measurements?.map((m) => (
          <AccordionItem value={m.id} key={m.id} className="border-b">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <div className="flex flex-col gap-2 no-underline">
                <div className="flex gap-2 items-center">
                  <h4 className="text-xl">
                    {new URL(m.redirect ?? m.url).host}
                    {new URL(m.redirect ?? m.url).pathname}
                  </h4>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    {getDeviceIcon(m.device.type, 'text-gray-400', 20)}
                    <span className="text-gray-400">
                      {toHeaderCase(m.device.type)}
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {getConnectionIcon(m.connectionType, 'text-gray-400', 20)}
                    <span className="text-gray-400">
                      {toHeaderCase(m.connectionType)
                        .replace('3g', '3G')
                        .replace('4g', '4G')}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-200">
                  {moment(m.createdAt).fromNow()}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col lg:flex-row mb-4 gap-2">
                  <div className="flex-1 lg:w-fit border rounded-md p-4">
                    <h5 className="uppercase text-gray-400">Total load time</h5>
                    <p
                      className={cn(
                        'text-lg lg:text-2xl font-light',
                        hasImproved(m).elapsed
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      {m.elapsed} ms
                    </p>
                  </div>
                  <div className="flex-1 lg:w-fit border rounded-md p-4">
                    <h5 className="uppercase text-gray-400">Bundle size</h5>
                    <p
                      className={cn(
                        'text-lg lg:text-2xl font-light',
                        hasImproved(m).bundleSize
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      {filesize(
                        m.bundledFiles.reduce(
                          (acc, file) => acc + Number(file.size),
                          0
                        )
                      )}
                    </p>
                  </div>
                  <div className="flex-1 lg:w-fit border rounded-md p-4">
                    <h5 className="text-sm uppercase text-gray-400">
                      Largest Contentful Paint
                    </h5>
                    <p
                      className={cn(
                        'text-lg lg:text-2xl font-light',
                        m.largestContentfulPaint && hasImproved(m).lcp
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      {m.largestContentfulPaint
                        ? `${m.largestContentfulPaint} ms`
                        : 'Error'}
                    </p>
                  </div>
                </div>
                {m.screenshots?.length ? (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-4 px-1 pb-6 pt-4 overflow-x-auto"
                  >
                    {m.screenshots.map((img, index) => (
                      <div
                        key={img}
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
                            {index === m.screenshots!.length - 1
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
                ) : null}
                <Bundle measurement={m} />
              </motion.div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default PathHistoryPage
