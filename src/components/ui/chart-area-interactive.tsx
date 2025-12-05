'use client'

import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useIsMobile } from '@/hooks/use-mobile'

export const description = 'An interactive area chart'

const chartData = [
  { date: '2024-04-01', cdn: 222, bundle: 15, font: 1 },
  { date: '2024-04-02', cdn: 97, bundle: 18, font: 1 },
  { date: '2024-04-03', cdn: 167, bundle: 12, font: 1 },
  { date: '2024-04-04', cdn: 242, bundle: 26, font: 2 },
  { date: '2024-04-05', cdn: 373, bundle: 29, font: 2 },
  { date: '2024-04-06', cdn: 301, bundle: 34, font: 3 },
  { date: '2024-04-07', cdn: 245, bundle: 18, font: 1 },
  { date: '2024-04-08', cdn: 409, bundle: 32, font: 3 },
  { date: '2024-04-09', cdn: 59, bundle: 11, font: 1 },
  { date: '2024-04-10', cdn: 261, bundle: 19, font: 1 },
  { date: '2024-04-11', cdn: 327, bundle: 35, font: 3 },
  { date: '2024-04-12', cdn: 292, bundle: 21, font: 2 },
  { date: '2024-04-13', cdn: 342, bundle: 38, font: 3 },
  { date: '2024-04-14', cdn: 137, bundle: 22, font: 2 },
  { date: '2024-04-15', cdn: 120, bundle: 17, font: 1 },
  { date: '2024-04-16', cdn: 138, bundle: 19, font: 1 },
  { date: '2024-04-17', cdn: 446, bundle: 36, font: 3 },
  { date: '2024-04-18', cdn: 364, bundle: 41, font: 4 },
  { date: '2024-04-19', cdn: 243, bundle: 18, font: 1 },
  { date: '2024-04-20', cdn: 89, bundle: 15, font: 1 },
  { date: '2024-04-21', cdn: 137, bundle: 20, font: 2 },
  { date: '2024-04-22', cdn: 224, bundle: 17, font: 1 },
  { date: '2024-04-23', cdn: 138, bundle: 23, font: 2 },
  { date: '2024-04-24', cdn: 387, bundle: 29, font: 2 },
  { date: '2024-04-25', cdn: 215, bundle: 25, font: 2 },
  { date: '2024-04-26', cdn: 75, bundle: 13, font: 1 },
  { date: '2024-04-27', cdn: 383, bundle: 42, font: 4 },
  { date: '2024-04-28', cdn: 122, bundle: 18, font: 1 },
  { date: '2024-04-29', cdn: 315, bundle: 24, font: 2 },
  { date: '2024-04-30', cdn: 454, bundle: 38, font: 3 },
  { date: '2024-05-01', cdn: 165, bundle: 22, font: 2 },
  { date: '2024-05-02', cdn: 293, bundle: 31, font: 3 },
  { date: '2024-05-03', cdn: 247, bundle: 19, font: 1 },
  { date: '2024-05-04', cdn: 385, bundle: 42, font: 4 },
  { date: '2024-05-05', cdn: 481, bundle: 39, font: 3 },
  { date: '2024-05-06', cdn: 498, bundle: 52, font: 5 },
  { date: '2024-05-07', cdn: 388, bundle: 30, font: 3 },
  { date: '2024-05-08', cdn: 149, bundle: 21, font: 2 },
  { date: '2024-05-09', cdn: 227, bundle: 18, font: 1 },
  { date: '2024-05-10', cdn: 293, bundle: 33, font: 3 },
  { date: '2024-05-11', cdn: 335, bundle: 27, font: 2 },
  { date: '2024-05-12', cdn: 197, bundle: 24, font: 2 },
  { date: '2024-05-13', cdn: 197, bundle: 16, font: 1 },
  { date: '2024-05-14', cdn: 448, bundle: 49, font: 4 },
  { date: '2024-05-15', cdn: 473, bundle: 38, font: 3 },
  { date: '2024-05-16', cdn: 338, bundle: 40, font: 4 },
  { date: '2024-05-17', cdn: 499, bundle: 42, font: 4 },
  { date: '2024-05-18', cdn: 315, bundle: 35, font: 3 },
  { date: '2024-05-19', cdn: 235, bundle: 18, font: 1 },
  { date: '2024-05-20', cdn: 177, bundle: 23, font: 2 },
  { date: '2024-05-21', cdn: 82, bundle: 14, font: 1 },
  { date: '2024-05-22', cdn: 81, bundle: 12, font: 1 },
  { date: '2024-05-23', cdn: 252, bundle: 29, font: 2 },
  { date: '2024-05-24', cdn: 294, bundle: 22, font: 2 },
  { date: '2024-05-25', cdn: 201, bundle: 25, font: 2 },
  { date: '2024-05-26', cdn: 213, bundle: 17, font: 1 },
  { date: '2024-05-27', cdn: 420, bundle: 46, font: 4 },
  { date: '2024-05-28', cdn: 233, bundle: 19, font: 1 },
  { date: '2024-05-29', cdn: 78, bundle: 13, font: 1 },
  { date: '2024-05-30', cdn: 340, bundle: 28, font: 2 },
  { date: '2024-05-31', cdn: 178, bundle: 23, font: 2 },
  { date: '2024-06-01', cdn: 178, bundle: 20, font: 2 },
  { date: '2024-06-02', cdn: 470, bundle: 41, font: 4 },
  { date: '2024-06-03', cdn: 103, bundle: 16, font: 1 },
  { date: '2024-06-04', cdn: 439, bundle: 38, font: 3 },
  { date: '2024-06-05', cdn: 88, bundle: 14, font: 1 },
  { date: '2024-06-06', cdn: 294, bundle: 25, font: 2 },
  { date: '2024-06-07', cdn: 323, bundle: 37, font: 3 },
  { date: '2024-06-08', cdn: 385, bundle: 32, font: 3 },
  { date: '2024-06-09', cdn: 438, bundle: 48, font: 4 },
  { date: '2024-06-10', cdn: 155, bundle: 20, font: 2 },
  { date: '2024-06-11', cdn: 92, bundle: 15, font: 1 },
  { date: '2024-06-12', cdn: 492, bundle: 42, font: 4 },
  { date: '2024-06-13', cdn: 81, bundle: 13, font: 1 },
  { date: '2024-06-14', cdn: 426, bundle: 38, font: 3 },
  { date: '2024-06-15', cdn: 307, bundle: 35, font: 3 },
  { date: '2024-06-16', cdn: 371, bundle: 31, font: 3 },
  { date: '2024-06-17', cdn: 475, bundle: 52, font: 5 },
  { date: '2024-06-18', cdn: 107, bundle: 17, font: 1 },
  { date: '2024-06-19', cdn: 341, bundle: 29, font: 2 },
  { date: '2024-06-20', cdn: 408, bundle: 45, font: 4 },
  { date: '2024-06-21', cdn: 169, bundle: 21, font: 2 },
  { date: '2024-06-22', cdn: 317, bundle: 27, font: 2 },
  { date: '2024-06-23', cdn: 480, bundle: 53, font: 5 },
  { date: '2024-06-24', cdn: 132, bundle: 18, font: 1 },
  { date: '2024-06-25', cdn: 141, bundle: 19, font: 1 },
  { date: '2024-06-26', cdn: 434, bundle: 38, font: 3 },
  { date: '2024-06-27', cdn: 448, bundle: 49, font: 4 },
  { date: '2024-06-28', cdn: 149, bundle: 20, font: 2 },
  { date: '2024-06-29', cdn: 103, bundle: 16, font: 1 },
  { date: '2024-06-30', cdn: 446, bundle: 40, font: 4 },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  cdn: {
    label: 'CDN',
    color: 'var(--color-green-500)',
  },
  bundle: {
    label: 'Bundle',
    color: 'var(--color-amber-500)',
  },
  font: {
    label: 'Font',
    color: 'var(--color-blue-500)',
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = useState('90d')

  useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCdn" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cdn)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cdn)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBundle" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bundle)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bundle)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFont" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-font)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-font)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="cdn"
              type="natural"
              fill="url(#fillCdn)"
              stroke="var(--color-cdn)"
            />
            <Area
              dataKey="bundle"
              type="natural"
              fill="url(#fillBundle)"
              stroke="var(--color-bundle)"
            />
            <Area
              dataKey="font"
              type="natural"
              fill="url(#fillFont)"
              stroke="var(--color-font)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
