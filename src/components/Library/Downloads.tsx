import { cn } from '@/lib/utils'
import { Link } from '@radix-ui/themes'
import type { LibraryUsage } from 'generated/graphql'
import { abbreviateNumber } from 'js-abbreviation-number'
import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'

interface DownloadsProps {
  library?: string
  downloads?: LibraryUsage['downloads']
  prevDownloads?: LibraryUsage['downloads']
}

const Downloads: React.FC<DownloadsProps> = ({
  library,
  downloads,
  prevDownloads,
}) => {
  return (
    <div className="hidden md:flex flex-col items-start gap-1">
      <div className="flex gap-1 items-center">
        <Link
          className="underline"
          target="_blank"
          href={`https://npmjs.com/package/${library}`}
        >
          NPM downloads
        </Link>
        <p className="text-sm text-muted-foreground">(last week)</p>
      </div>
      <p className="text-4xl font-light">
        {downloads ? abbreviateNumber(Number(downloads)) : 'Loading...'}
      </p>
      {prevDownloads !== null && downloads !== null && (
        <div
          className={cn(
            'flex gap-1',
            Number(downloads) > Number(prevDownloads)
              ? 'text-green-500'
              : Number(downloads) < Number(prevDownloads)
              ? 'text-red-500'
              : 'text-yellow-500'
          )}
        >
          {Number(downloads) > Number(prevDownloads) ? (
            <TrendingUp width={20} className="inline-block mb-1 mr-1" />
          ) : Number(downloads) < Number(prevDownloads) ? (
            <TrendingDown width={20} className="inline-block mb-1 mr-1" />
          ) : (
            <MoveRight width={20} className="inline-block mb-1 mr-1" />
          )}
          <p>{abbreviateNumber(Number(downloads) - Number(prevDownloads))}</p>
        </div>
      )}
    </div>
  )
}

export default Downloads
