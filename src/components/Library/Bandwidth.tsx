import { useUsageStats, type UsageStats } from '@/hooks/useUsageStats'
import { cn } from '@/lib/utils'
import { Link } from '@radix-ui/themes'
import { filesize } from 'filesize'
import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface UsageProps {
  library?: string
}

const Usage: React.FC<UsageProps> = ({ library }) => {
  const { fetchUsageStats, usage } = useUsageStats()
  const [prevUsage, setPrevUsage] = useState<UsageStats | null>(null)

  useEffect(() => {
    if (library) {
      fetchUsageStats(library).then(() => {
        const previousMonth = 's-month'
        fetchUsageStats(library, previousMonth).then((prevUsage) => {
          setPrevUsage(prevUsage)
        })
      })
    }
  }, [library, fetchUsageStats])

  return (
    <div className="hidden md:flex flex-col items-start gap-1">
      <div className="flex gap-1 items-center">
        <Link
          className="underline"
          target="_blank"
          href={`https://www.jsdelivr.com/package/npm/${library}?tab=stats`}
        >
          CDN bandwidth
        </Link>
        <p className="text-sm text-muted-foreground">(last week)</p>
      </div>
      <p className="text-4xl font-light">
        {usage !== null ? filesize(usage.bandwidth.total) : 'Loading...'}
      </p>
      {usage &&
        usage?.bandwidth.total !== null &&
        prevUsage &&
        prevUsage?.bandwidth.total !== null && (
          <div
            className={cn(
              'flex gap-1',
              usage.bandwidth.rank > prevUsage?.bandwidth.rank
                ? 'text-green-500'
                : usage.bandwidth.rank < prevUsage?.bandwidth.rank
                ? 'text-red-500'
                : 'text-yellow-500'
            )}
          >
            {usage.bandwidth.rank > prevUsage?.bandwidth.rank ? (
              <TrendingUp width={20} className="inline-block mb-1 mr-1" />
            ) : usage.bandwidth.rank < prevUsage?.bandwidth.rank ? (
              <TrendingDown width={20} className="inline-block mb-1 mr-1" />
            ) : (
              <MoveRight width={20} className="inline-block mb-1 mr-1" />
            )}
            <p>#{usage.bandwidth.rank}</p>
          </div>
        )}
    </div>
  )
}

export default Usage
