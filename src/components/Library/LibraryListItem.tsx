import { abbreviateNumber } from 'js-abbreviation-number'
import { Globe, PackageIcon, Star } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface LibraryListItemProps {
  library: {
    id: string
    name: string
    description?: string | null
    integrated?: boolean | null
    homepage?: string | null
    repository?: string | null
    recentDownloads?: { total: string; rank: string } | null
    recentBandwidth?: { total: string; rank: string } | null
    subpaths?: Array<{ id: string; path: string }> | null
    isStarred?: boolean | null
  }
  badge?: React.ReactNode
}

export function LibraryListItem({ library, badge }: LibraryListItemProps) {
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow duration-300 flex-col my-1 p-4 border border-white hover:border-gray-300 rounded-xl',
        library.integrated
          ? 'hover:bg-green-200/10 hover:border-green-400 transition-all'
          : 'hover:bg-gray-200/10 hover:border-gray-300 transition-all',
      )}
      onClick={() => navigate('/l/' + encodeURIComponent(library.name))}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <PackageIcon
            className={cn(
              'stroke-[1.5]',
              library.integrated
                ? 'text-green-800 fill-green-500'
                : 'fill-gray-200',
            )}
            width={24}
            height={24}
          />
          <h3 className="text-xl">{library.name}</h3>
          {badge}
        </div>
        <div className="flex gap-2 items-center">
          {library.isStarred && (
            <Star
              className={cn('h-5 w-5', 'fill-yellow-400 text-yellow-400')}
            />
          )}
          {library.homepage && (
            <Globe
              className={cn(
                'h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer',
                library.integrated && 'text-green-500',
              )}
              onClick={(e) => {
                e.stopPropagation()
                window.open(library.homepage!, '_blank')
              }}
            />
          )}
          {library.repository && (
            <Icons.gitHub
              className={cn(
                'h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer',
                library.integrated && 'text-green-500',
              )}
              onClick={(e) => {
                e.stopPropagation()
                window.open(library.repository!.replace('git+', ''), '_blank')
              }}
            />
          )}
          <Icons.npm
            className={cn(
              'h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer',
              library.integrated && 'text-green-500',
            )}
            onClick={(e) => {
              e.stopPropagation()
              window.open(
                `https://npmjs.com/${encodeURIComponent(library.name)}`,
                '_blank',
              )
            }}
          />
        </div>
      </div>
      {library.description && (
        <p className="text-md text-muted-foreground my-2">
          {library.description}
        </p>
      )}
      <div className="flex items-center gap-3">
        {library.recentDownloads && (
          <p className="text-sm text-gray-400">
            {abbreviateNumber(
              Number(library.recentDownloads.total),
              undefined,
              { symbols: ['', 'k', 'M', 'B', 'T'] },
            )}{' '}
            downloads
          </p>
        )}
        {library.recentBandwidth &&
          Number(library.recentBandwidth.total) > 0 && (
            <p className="text-sm text-gray-400">
              #{library.recentBandwidth.rank} bandwidth
            </p>
          )}
      </div>
      {library.subpaths && library.subpaths.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {library.subpaths.map((subpath) => (
            <span
              key={subpath.id}
              className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full"
            >
              {subpath.path}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
