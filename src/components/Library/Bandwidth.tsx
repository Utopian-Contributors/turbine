import { cn } from '@/lib/utils'
import { Link } from '@radix-ui/themes'
import { filesize } from 'filesize'
import type { LibraryUsage } from 'generated/graphql'
import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'

interface UsageProps {
  library?: string
  usage?: LibraryUsage['bandwidth']
  prevUsage?: LibraryUsage['bandwidth']
}

const Usage: React.FC<UsageProps> = ({ library, usage, prevUsage }) => {
  return (
    <div className="flex flex-col items-start gap-1">
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
        {usage?.total ? filesize(usage.total) : 'Loading...'}
      </p>
      {usage &&
        usage?.total !== null &&
        prevUsage &&
        prevUsage?.total !== null && (
          <div
            className={cn(
              'flex gap-1',
              usage.rank > prevUsage?.rank
                ? 'text-green-500'
                : usage.rank < prevUsage?.rank
                ? 'text-red-500'
                : 'text-yellow-500'
            )}
          >
            {usage.rank > prevUsage?.rank ? (
              <TrendingUp width={20} className="inline-block mb-1 mr-1" />
            ) : usage.rank < prevUsage?.rank ? (
              <TrendingDown width={20} className="inline-block mb-1 mr-1" />
            ) : (
              <MoveRight width={20} className="inline-block mb-1 mr-1" />
            )}
            <p>#{usage.rank}</p>
          </div>
        )}
    </div>
  )
}

export default Usage
