import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import { Badge } from '../ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface StatisticsProps {
  statistics: {
    label: string
    unit?: string
    total: number
    change?: number
    description?: string
  }[]
}

const Statistics: React.FC<StatisticsProps> = ({ statistics }) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 xl:grid-cols-4">
      {statistics.map((s) => (
        <Card>
          <CardHeader>
            <CardDescription className="flex justify-between">
              <span>{s.label}</span>
              <Badge
                className={cn(
                  'text-background',
                  s.change > 0 ? 'bg-green-500' : 'bg-red-500'
                )}
              >
                {s.change > 0 ? <TrendingUp /> : <TrendingDown />}
                {s.change > 0 ? '+' : ''}
                {s.change}%
              </Badge>
            </CardDescription>
            <CardTitle className="whitespace-nowrap text-4xl font-semibold tabular-nums">
              {s.total} <span className="text-sm">{s.unit}</span>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{s.description}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default Statistics
