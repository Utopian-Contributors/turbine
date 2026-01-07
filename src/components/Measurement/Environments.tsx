import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import { motion } from 'framer-motion'
import { toHeaderCase, toSentenceCase } from 'js-convert-case'
import {
  CircleCheck,
  CircleX
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'

import { getConnectionIcon, getDeviceIcon } from '@/helpers/icons'
import { useWalletOrAccLogin } from '@/hooks/useWalletOrAccLogin'
import { TabsContent } from '@radix-ui/react-tabs'
import {
  ConnectionType,
  DeviceType,
  MeasurementStatus,
  useMeasurementDevicesQuery,
  type MeasuredFileFragment,
  type Measurement,
} from '../../../generated/graphql'
import Pricetag from '../Pricetag'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { Spinner } from '../ui/spinner'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

interface EnvironmentsProps {
  measurements: (Pick<
    Measurement,
    'id' | 'url' | 'elapsed' | 'status' | 'device' | 'connectionType'
  > & {
    bundledFiles: MeasuredFileFragment[]
  })[]
  selectedPath?: string
  current: Pick<Measurement, 'id' | 'host' | 'elapsed'> & {
    bundledFiles: MeasuredFileFragment[]
  }
  initial: ConnectionType
  onClick: (device: DeviceType, connection: ConnectionType) => void
}

const Environments: React.FC<EnvironmentsProps> = ({
  measurements,
  current,
  selectedPath,
  initial,
  onClick,
}) => {
  const { login, isLoggedIn } = useWalletOrAccLogin()
  const navigate = useNavigate()

  const { data: measurementDevicesData } = useMeasurementDevicesQuery()

  if (
    !measurementDevicesData?.measurementDevices ||
    !measurementDevicesData.measurementDevices.length
  ) {
    return null
  }

  const possibleConnections = [
    ConnectionType.Wifi,
    ConnectionType.Fast_4G,
    ConnectionType.Slow_4G,
    ConnectionType.Fast_3G,
    ConnectionType.Slow_3G,
  ]

  const possibleDevices = measurementDevicesData.measurementDevices

  return (
    <Tabs
      defaultValue={initial || possibleConnections[0]}
      className="py-4 lg:px-6 lg:py-4"
    >
      <div className="flex flex-col lg:flex-row gap-2">
        <TabsList>
          {possibleConnections.map((connection) => (
            <TabsTrigger
              key={connection}
              value={connection}
              disabled={connection === ConnectionType.Offline}
            >
              {toHeaderCase(connection)
                .replace('3g', '3G')
                .replace('4g', '4G')
                .replace('Wifi', 'WiFi')}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {possibleConnections.map((connection) => (
        <TabsContent key={connection} value={connection}>
          <div className="w-full flex gap-6 overflow-x-auto p-1">
            {possibleDevices
              .map((device) => {
                const measurementForDevice = measurements?.find(
                  (m) =>
                    m.device.id === device.id && m.connectionType === connection
                )
                return { measurementForDevice, device, connection }
              })
              .sort(
                ({ measurementForDevice: a }, { measurementForDevice: b }) => {
                  if (!a && b) return 1
                  if (a && !b) return -1
                  return 0
                }
              )
              .map(({ measurementForDevice, device, connection }, index) => {
                const loadTime = measurementForDevice
                  ? `${(measurementForDevice.elapsed ?? 0) / 1000}s`
                  : `${(current?.elapsed ?? 0) / 1000}s`
                const totalSize = filesize(
                  measurementForDevice
                    ? measurementForDevice.bundledFiles.reduce(
                        (a, b) => a + Number(b.size),
                        0
                      )
                    : current?.bundledFiles.reduce(
                        (a, b) => a + Number(b.size),
                        0
                      )
                )
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: 0 + index * 0.2,
                    }}
                    key={`${device.type}-${connection}`}
                  >
                    <Card
                      className={cn(
                        'cursor-pointer min-w-[16rem] lg:min-w-xs',
                        measurementForDevice
                          ? 'bg-gradient-to-t from-primary/2 to-card'
                          : 'opacity-30 hover:opacity-100 transition duration-300',
                        measurementForDevice?.status ===
                          MeasurementStatus.Pending
                          ? 'animate-pulse'
                          : '',
                        current.id === measurementForDevice?.id
                          ? 'ring ring-green-500'
                          : ''
                      )}
                      onClick={() => {
                        if (isLoggedIn) {
                          onClick(device.type, connection)
                          navigate(
                            `/measurements/${current.host?.host}?path=${selectedPath}&device=${device.type}&connection=${connection}`,
                            { replace: true }
                          )
                        } else if (current.id !== measurementForDevice?.id) {
                          login()
                        }
                      }}
                    >
                      <CardHeader>
                        <div className="h-[40px] flex items-center justify-between">
                          <div className={'flex items-center gap-2'}>
                            {getDeviceIcon(device.type)}
                            <h3 className="text-xl">
                              {toSentenceCase(device.type)}
                            </h3>
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
                            <CircleX
                              size={40}
                              className="text-white fill-red-500"
                            />
                          ) : (
                            <Pricetag />
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
                                ) : measurementForDevice?.status ===
                                  MeasurementStatus.Failed ? (
                                  'Error'
                                ) : (
                                  loadTime
                                )}
                              </div>
                              <span>Total size</span>
                              <div className="text-2xl font-light">
                                {measurementForDevice?.status ===
                                MeasurementStatus.Pending ? (
                                  <Skeleton className="w-[64px] h-9" />
                                ) : measurementForDevice?.status ===
                                  MeasurementStatus.Failed ? (
                                  'Error'
                                ) : (
                                  totalSize
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <div className="flex items-center gap-1">
                                {getConnectionIcon(connection)}
                                <span className="text-lg text-muted-foreground">
                                  {toHeaderCase(connection)
                                    .replace('4g', '4G')
                                    .replace('3g', '3G')}
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
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default Environments
