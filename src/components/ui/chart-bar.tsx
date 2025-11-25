'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
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
  label: string
  description: string
  data: ChartData[]
  config: ChartConfig
  classname?: string
}> = ({ label, description, data, config, classname }) => {
  return (
    <div className={cn('border rounded-xl space-y-4 p-4', classname)}>
      <div>
        <h1 className="text-lg">{label}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <ChartContainer config={config}>
        <BarChart accessibilityLayer data={data} layout="horizontal">
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
                      <p className="text-muted-foreground">Bandwidth</p>
                      <p>{filesize(value as number)}</p>
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
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
