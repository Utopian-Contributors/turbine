import { abbreviateNumber } from 'js-abbreviation-number'
import { Clock, Loader2, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router'

import { LibraryListItem } from '@/components/Library/LibraryListItem'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import {
  TopLibrariesOrderBy,
  useFastestGrowingLibrariesQuery,
  useOldtimerLibrariesQuery,
  useTopLibrariesQuery,
} from '../../../generated/graphql'

const PAGE_SIZE = 20

export function TopPackagesTab() {
  const [orderBy, setOrderBy] = useState<TopLibrariesOrderBy>(
    TopLibrariesOrderBy.Downloads,
  )
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()

  const { data, loading, fetchMore } = useTopLibrariesQuery({
    variables: { orderBy, pagination: { take: PAGE_SIZE } },
  })
  const { data: fastestGrowingData } = useFastestGrowingLibrariesQuery()
  const { data: oldtimersData } = useOldtimerLibrariesQuery()

  useEffect(() => {
    document.title = 'Turbine | Top Packages'
  }, [])

  useEffect(() => {
    setHasMore(true)
  }, [orderBy])

  useEffect(() => {
    if (data?.topLibraries?.libraries && !loading) {
      if (data.topLibraries.libraries.length < PAGE_SIZE) {
        setHasMore(false)
      }
    }
  }, [data?.topLibraries?.libraries, loading])

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return

    fetchMore({
      variables: {
        orderBy,
        pagination: {
          skip: data?.topLibraries?.libraries.length ?? 0,
          take: PAGE_SIZE,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.topLibraries) return prev

        const newLibraries = fetchMoreResult.topLibraries.libraries
        if (newLibraries.length < PAGE_SIZE) {
          setHasMore(false)
        }

        return {
          ...prev,
          topLibraries: {
            ...prev.topLibraries!,
            libraries: [
              ...(prev.topLibraries?.libraries ?? []),
              ...newLibraries,
            ],
          },
        }
      },
    })
  }, [
    data?.topLibraries?.libraries.length,
    fetchMore,
    hasMore,
    loading,
    orderBy,
  ])

  const { ref: lastItemRef, inView } = useInView()

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore()
    }
  }, [inView, hasMore, loading, loadMore])

  if (loading && !data) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto flex gap-6 pt-6">
      {/* Main content */}
      <div className="flex-1">
        {/* Stats header */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-4xl font-thin">
                {abbreviateNumber(
                  Number(data?.topLibraries?.stats.totalDownloads ?? '0'),
                  undefined,
                  { symbols: ['', 'k', 'M', 'B', 'T'] },
                )}
              </p>
              <p className="text-sm uppercase text-gray-300">
                Total downloads (Top 100)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-4xl font-thin">
                {data?.topLibraries?.stats.totalBandwidth}
              </p>
              <p className="text-sm uppercase text-gray-300">
                Total bandwidth (Top 100)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order toggle */}
        <div className="sticky top-0 backdrop-blur-sm flex justify-between items-center mt-6 py-4">
          <h2 className="text-lg font-semibold">Top Packages</h2>
          <ToggleGroup
            type="single"
            value={orderBy}
            onValueChange={(v) => v && setOrderBy(v as TopLibrariesOrderBy)}
          >
            <ToggleGroupItem value={TopLibrariesOrderBy.Downloads}>
              Downloads
            </ToggleGroupItem>
            <ToggleGroupItem value={TopLibrariesOrderBy.Bandwidth}>
              Bandwidth
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Library list */}
        <div className="flex flex-col gap-1">
          {data?.topLibraries?.libraries.map((library, index) => (
            <div
              key={library.id}
              ref={
                index === (data?.topLibraries?.libraries.length ?? 0) - 1
                  ? lastItemRef
                  : null
              }
            >
              <LibraryListItem library={library} />
              {index < (data?.topLibraries?.libraries.length ?? 0) - 1 && (
                <Separator className="bg-muted mt-4 mb-2" />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="sticky max-h-full top-4 w-64 space-y-5 flex-shrink-0 self-start">
        {/* Fastest Growing */}
        <Card className="max-h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Fastest Growing
            </CardTitle>
            <CardDescription className="text-xs text-balance">
              Month-over-month download growth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto max-h-[calc(50vh-72px-2rem-104px)]">
            {fastestGrowingData?.fastestGrowingLibraries?.map((item) => (
              <div
                key={item.library.id}
                className="text-sm flex justify-between items-center cursor-pointer hover:bg-muted/50 p-1 rounded"
                onClick={() =>
                  navigate('/l/' + encodeURIComponent(item.library.name))
                }
              >
                <span
                  className={cn(
                    'font-medium truncate',
                    item.library.integrated && 'text-green-700',
                  )}
                >
                  {item.library.name}
                </span>
                <span className="text-green-500 ml-2 flex-shrink-0">
                  +{item.growthRate.toFixed(1)}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Oldtimers */}
        <Card className="max-h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-gray-500" />
              Oldtimers
            </CardTitle>
            <CardDescription className="text-xs text-balance">
              Time spent in the top 100 downloaded packages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto max-h-[calc(50vh-72px-2rem-104px)]">
            {oldtimersData?.oldtimerLibraries?.map((item) => (
              <div
                key={item.library.id}
                className="text-sm flex justify-between items-center cursor-pointer hover:bg-muted/50 p-1 rounded"
                onClick={() =>
                  navigate('/l/' + encodeURIComponent(item.library.name))
                }
              >
                <span
                  className={cn(
                    'font-medium truncate',
                    item.library.integrated && 'text-green-700',
                  )}
                >
                  {item.library.name}
                </span>
                <span className="text-gray-300 ml-2 flex-shrink-0">
                  {item.weeksInTop100}w
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
