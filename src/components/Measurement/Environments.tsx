import { cn } from '@/lib/utils'
import { Spinner } from '@radix-ui/themes'
import { filesize } from 'filesize'
import { motion } from 'framer-motion'
import { toSentenceCase } from 'js-convert-case'
import {
  CircleCheck,
  CirclePlay,
  CircleX,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'

import {
  ConnectionType,
  DeviceType,
  MeasurementStatus,
  useMeasurementDevicesQuery,
  type MeasuredFileFragment,
  type Measurement,
} from '../../../generated/graphql'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const getDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case DeviceType.Mobile:
      return <Smartphone size={28} />
    case DeviceType.Tablet:
      return <Tablet size={28} />
    default:
      return <Monitor size={28} />
  }
}

interface EnvironmentsProps {
  measurements: (Pick<
    Measurement,
    'id' | 'url' | 'elapsed' | 'status' | 'device'
  > & {
    bundledFiles: MeasuredFileFragment[]
  })[]
  current: Pick<Measurement, 'id' | 'url' | 'elapsed'> & {
    bundledFiles: MeasuredFileFragment[]
  }
  onClick: (device: DeviceType, connection: ConnectionType) => void
}

const Environments: React.FC<EnvironmentsProps> = ({
  measurements,
  current,
  onClick,
}) => {
  const navigate = useNavigate()

  const { data: measurementDevicesData } = useMeasurementDevicesQuery()

  if (
    !measurementDevicesData?.measurementDevices ||
    !measurementDevicesData.measurementDevices.length
  ) {
    return null
  }

  return (
    <div className="w-full flex gap-6 overflow-x-auto p-6">
      {measurementDevicesData.measurementDevices.map((device, index) => {
        const measurementForDevice = measurements?.find(
          (m) => m.device.type === device.type
        )
        const loadTime = measurementForDevice
          ? `${(measurementForDevice.elapsed ?? 0) / 1000}s`
          : `${(current?.elapsed ?? 0) / 1000}s`
        const totalSize = filesize(
          measurementForDevice
            ? measurementForDevice.bundledFiles.reduce(
                (a, b) => a + Number(b.size),
                0
              )
            : current?.bundledFiles.reduce((a, b) => a + Number(b.size), 0)
        )
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.5 + index * 0.2,
            }}
            key={device.type}
          >
            <Card
              className={cn(
                'cursor-pointer min-w-xs',
                measurementForDevice
                  ? ''
                  : 'opacity-30 hover:opacity-100 transition duration-300',
                measurementForDevice?.status === MeasurementStatus.Pending
                  ? 'animate-pulse'
                  : '',
                current.id === measurementForDevice?.id
                  ? 'ring-2 ring-green-500'
                  : ''
              )}
              onClick={() => {
                onClick(device.type, ConnectionType.Wifi)
                navigate(
                  `?url=${encodeURIComponent(current.url)}&device=${
                    device.type
                  }&connection=${ConnectionType.Wifi}`,
                  { replace: true }
                )
              }}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <div className={'flex items-center gap-2'}>
                    {getDeviceIcon(device.type)}
                    <h3 className="text-xl">{toSentenceCase(device.type)}</h3>
                  </div>
                  {measurementForDevice &&
                  measurementForDevice.status ===
                    MeasurementStatus.Completed ? (
                    <CircleCheck
                      size={40}
                      className="text-white fill-green-500"
                    />
                  ) : measurementForDevice?.status ===
                    MeasurementStatus.Pending ? (
                    <Spinner className="h-8 w-8 text-gray-200" />
                  ) : measurementForDevice?.status ===
                    MeasurementStatus.Failed ? (
                    <CircleX size={40} className="text-red-200" />
                  ) : (
                    <CirclePlay size={32} className="m-[4px] text-gray-200" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div
                      className={cn(
                        'flex flex-col gap-1',
                        measurementForDevice ? '' : 'blur-xs'
                      )}
                    >
                      <span>Total load time</span>
                      <div className="text-2xl font-light mr-6">
                        {measurementForDevice?.status ===
                        MeasurementStatus.Pending ? (
                          <Skeleton className="w-[64px] h-9" />
                        ) : (
                          loadTime
                        )}
                      </div>
                      <span>Total size</span>
                      <div className="text-2xl font-light">
                        {measurementForDevice?.status ===
                        MeasurementStatus.Pending ? (
                          <Skeleton className="w-[64px] h-9" />
                        ) : (
                          totalSize
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Wifi className="text-muted-foreground" />
                        <span className="text-lg text-muted-foreground">
                          Wifi
                        </span>
                      </div>
                      <span className="text-lg text-muted-foreground">
                        {device.width} x {device.height}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default Environments
