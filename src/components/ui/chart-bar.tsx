'use client'

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'

import { cn } from '@/lib/utils'
import { abbreviateNumber } from 'js-abbreviation-number'
import { ZapIcon } from 'lucide-react'
import type { ChartConfig } from './chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart'

export const description = 'A bar chart with a custom label'

export interface ChartData {
  label: string
  value: number
  formattedValue: string
}

export const ChartBarLabelCustom: React.FC<{
  description: string
  data: ChartData[]
  config: ChartConfig
  classname?: string
}> = ({ description, data, config, classname }) => {
  return (
    <div className={cn('space-y-4 px-2 py-1', classname)}>
      <div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChartContainer config={config}>
        <BarChart
          accessibilityLayer
          data={data}
          layout="horizontal"
          margin={{ top: 24 }}
        >
          <XAxis
            dataKey="label"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis dataKey="value" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value) => (
                  <div className="flex gap-2 items-center">
                    <ZapIcon width={20} className="text-green-600" />
                    <div className="flex flex-col">
                      <p className="text-muted-foreground">Downloads</p>
                      <p>{abbreviateNumber(value as number)}</p>
                    </div>
                  </div>
                )}
              />
            }
          />
          <Bar
            dataKey="value"
            layout="horizontal"
            fill="var(--color-value)"
            radius={4}
            height={40}
          >
            <LabelList dataKey="formattedValue" position="top" />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
