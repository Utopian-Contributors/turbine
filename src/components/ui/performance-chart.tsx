import { filesize } from 'filesize'
import { ArrowDown, ArrowUp } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { toHeaderCase } from 'js-convert-case'
import { ConnectionType, DeviceType } from '../../../generated/graphql'
import { Card, CardContent, CardFooter, CardHeader } from './card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart'
import { Select, SelectContent, SelectItem, SelectTrigger } from './select'

interface PerformanceChartProps {
  data: {
    time: string
    elapsed: number | null
    bundleSize: number | null
    largestContentfulPaint?: number | null
  }[]
  performanceImprovements?: {
    elapsed?: number
    lcp?: number
    bundleSize?: number
  }
  timeframe?: string
  selectedDevice?: DeviceType
  selectedConnection?: ConnectionType
  onDeviceChange: (type: DeviceType) => void
  onConnectionChange: (type: ConnectionType) => void
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  performanceImprovements,
  timeframe,
  selectedDevice,
  selectedConnection,
  onDeviceChange,
  onConnectionChange,
}) => {
  const totalImprovement = performanceImprovements
    ? ((performanceImprovements.elapsed || 0) +
        (performanceImprovements.bundleSize || 0) +
        (performanceImprovements.lcp || 0)) /
      [
        performanceImprovements.elapsed,
        performanceImprovements.bundleSize,
        performanceImprovements.lcp,
      ].filter(Boolean).length
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2">
          <Select
            defaultValue={selectedDevice}
            onValueChange={(value) => onDeviceChange(value as DeviceType)}
          >
            <SelectTrigger className="w-fit">
              {toHeaderCase(selectedDevice)}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DeviceType.Desktop}>Desktop</SelectItem>
              <SelectItem value={DeviceType.Tablet}>Tablet</SelectItem>
              <SelectItem value={DeviceType.Mobile}>Mobile</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue={selectedConnection}
            onValueChange={(value) =>
              onConnectionChange(value as ConnectionType)
            }
          >
            <SelectTrigger className="w-fit">
              {toHeaderCase(selectedConnection)
                .replace('3g', '3G')
                .replace('4g', '4G')
                .replace('Wifi', 'WiFi')}
            </SelectTrigger>
            <SelectContent>
              {[...Object.values(ConnectionType)]
                .filter((c) => c !== ConnectionType.Offline)
                .reverse()
                .map((type) => (
                  <SelectItem value={type} key={type}>
                    {toHeaderCase(type)
                      .replace('3g', '3G')
                      .replace('4g', '4G')
                      .replace('Wifi', 'WiFi')}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 1 ? (
          <ChartContainer
            config={{
              elapsed: {
                label: 'Load time',
                color: 'var(--color-green-500)',
                unit: 'ms',
              },
              bundleSize: {
                label: 'Bundle Size',
                color: 'var(--color-amber-500)',
              },
              largestContentfulPaint: {
                label: 'LCP',
                color: 'var(--color-purple-500)',
                unit: 'ms',
              },
            }}
          >
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => moment(value).fromNow()}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    valueFormatter={(value, label) =>
                      (label === 'Load time' || label === 'LCP') &&
                      typeof value === 'number'
                        ? value / 1_000
                        : label === 'Bundle Size' && typeof value === 'number'
                        ? filesize(value)
                        : value
                    }
                  />
                }
              />
              <Line
                dataKey="elapsed"
                type="linear"
                stroke="var(--color-green-500)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="bundleSize"
                type="linear"
                stroke="var(--color-amber-500)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="largestContentfulPaint"
                type="linear"
                stroke="var(--color-purple-500)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <p className="w-full text-gray-200 text-center my-32">
            Not enough data points.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {totalImprovement && totalImprovement > 0 ? (
          <div className="flex gap-2 items-center font-medium">
            Performance decreased by{' '}
            <div className="flex gap-1 items-center">
              <ArrowDown className="text-red-500" size={24} />{' '}
              <span className="text-red-500">
                {totalImprovement.toFixed(2)}%
              </span>
            </div>
          </div>
        ) : totalImprovement ? (
          <div className="flex gap-2 items-center font-medium text-xl">
            Performance improved by{' '}
            <div className="flex gap-1 items-center">
              <ArrowUp className="text-green-500" size={24} />{' '}
              <span className="text-green-500">
                {Math.abs(totalImprovement)?.toFixed(2)}%
              </span>
            </div>
          </div>
        ) : null}
        {timeframe ? (
          <div className="text-muted-foreground">
            Showing performance metrics for the last {timeframe}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  )
}

export default PerformanceChart
