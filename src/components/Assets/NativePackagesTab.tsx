import { ExternalLink, Hammer } from 'lucide-react'
import moment from 'moment'

import { LibraryListItem } from '@/components/Library/LibraryListItem'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEffect } from 'react'
import { useNativePackagesQuery } from '../../../generated/graphql'

export function NativePackagesTab() {
  const { data, loading } = useNativePackagesQuery({
    variables: { pagination: { take: 100 } },
  })

  useEffect(() => {
    document.title = 'Turbine | Native Packages'
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    )
  }

  const upcomingPackages = data?.nativePackages?.upcoming ?? []
  const publishedByPeriod = data?.nativePackages?.publishedByPeriod ?? []
  const totalPublished = publishedByPeriod.reduce(
    (sum, period) => sum + period.packages.length,
    0,
  )

  return (
    <div className="max-w-2xl mx-auto pt-6">
      {/* Info box */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Hammer className="h-5 w-5" />
            Native Packages
          </CardTitle>
          <CardDescription className="text-blue-950">
            These packages are integrated into the{' '}
            <a
              href="https://browser.utopian.build"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b-[0.5px] border-blue-700 hover:text-blue-900 hover:border-blue-900 font-medium"
            >
              Utopia Browser
              <ExternalLink size={12} className="inline ml-1 mb-1" />
            </a>{' '}
            via the <code className="bg-blue-100 px-1 rounded">native:</code>{' '}
            URL scheme and can be used natively within the browser without
            downloading them from external CDNs. They are also available to
            other browsers and programs via the browser-native supply chain
            releases.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upcoming packages */}
      {upcomingPackages.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Upcoming
            <Badge variant="secondary">{upcomingPackages.length}</Badge>
          </h2>
          <div className="flex flex-col gap-1 mb-8">
            {upcomingPackages.map((pkg, index) => (
              <div key={pkg.library.id}>
                <LibraryListItem
                  library={pkg.library}
                  badge={
                    <Badge variant="outline" className="ml-2 text-xs">
                      Coming Soon
                    </Badge>
                  }
                />
                {index < upcomingPackages.length - 1 && (
                  <Separator className="bg-muted mt-4 mb-2" />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Published packages grouped by period */}
      {totalPublished > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Published
            <Badge variant="default" className="bg-green-500">
              {totalPublished}
            </Badge>
          </h2>

          {publishedByPeriod.map((period) => (
            <div key={period.period} className="mb-6">
              <h3 className="text-sm font-bold uppercase text-gray-200 mb-3">
                {period.period}
              </h3>
              <div className="flex flex-col gap-1">
                {period.packages.map((pkg, index) => (
                  <div key={pkg.library.id}>
                    <LibraryListItem
                      library={pkg.library}
                      badge={
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground ml-2"
                        >
                          {moment(pkg.releaseDate).format('MMM D')}
                          {pkg.releaseVersion && ` · v${pkg.releaseVersion}`}
                        </Badge>
                      }
                    />
                    {index < period.packages.length - 1 && (
                      <Separator className="bg-muted mt-4 mb-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {totalPublished === 0 && upcomingPackages.length === 0 && (
        <p className="text-gray-400 text-center py-8">
          No native packages yet.
        </p>
      )}
    </div>
  )
}
