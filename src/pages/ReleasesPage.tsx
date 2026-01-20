import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Hammer, Plus, Send } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import {
  NativeSupplyChainReleaseStatus,
  ReleasesDocument,
  useBuildReleaseMutation,
  useLoggedInQuery,
  usePublishReleaseMutation,
  useReleasesQuery,
} from '../../generated/graphql'

const statusBadgeVariant = (
  status: NativeSupplyChainReleaseStatus
): 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case NativeSupplyChainReleaseStatus.Published:
      return 'default'
    case NativeSupplyChainReleaseStatus.Pending:
      return 'secondary'
    case NativeSupplyChainReleaseStatus.Development:
      return 'outline'
  }
}

const statusLabel = (status: NativeSupplyChainReleaseStatus): string => {
  switch (status) {
    case NativeSupplyChainReleaseStatus.Published:
      return 'Published'
    case NativeSupplyChainReleaseStatus.Pending:
      return 'Building...'
    case NativeSupplyChainReleaseStatus.Development:
      return 'Development'
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ReleasePageProps {}

const ReleasesPage: React.FC<ReleasePageProps> = () => {
  const navigate = useNavigate()
  const { data } = useReleasesQuery({ pollInterval: 5000 })
  const { data: loggedInQueryData } = useLoggedInQuery()

  const [buildRelease, { loading: buildLoading }] = useBuildReleaseMutation({
    refetchQueries: [{ query: ReleasesDocument }],
  })
  const [publishRelease, { loading: publishLoading }] =
    usePublishReleaseMutation({
      refetchQueries: [{ query: ReleasesDocument }],
    })

  useEffect(() => {
    document.title = 'Turbine | Releases'
  }, [])

  const isAdmin = loggedInQueryData?.loggedIn

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Releases</h1>
        {isAdmin && (
          <Button
            className="flex gap-2"
            onClick={() => navigate('/releases/new')}
          >
            <Plus size={20} />
            New
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {!data?.releases?.length && (
          <span className="text-muted-foreground mx-auto">No Releases yet</span>
        )}
        {data?.releases?.map((r) => {
          const isDevelopment =
            r.status === NativeSupplyChainReleaseStatus.Development

          return (
            <div
              key={r.id}
              className="border rounded-md p-6 hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => navigate(`/releases/${r.id}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{r.version}</h2>
                  <Badge variant={statusBadgeVariant(r.status)}>
                    {statusLabel(r.status)}
                  </Badge>
                </div>
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {r.downloadUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={r.downloadUrl} target="_blank" rel="noreferrer">
                        <Download size={16} className="mr-1" />
                        Download
                      </a>
                    </Button>
                  )}
                  {isAdmin && isDevelopment && !r.downloadUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => buildRelease({ variables: { id: r.id } })}
                      disabled={buildLoading}
                    >
                      <Hammer size={16} className="mr-1" />
                      Build
                    </Button>
                  )}
                  {isAdmin && isDevelopment && r.downloadUrl && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          buildRelease({ variables: { id: r.id } })
                        }
                        disabled={buildLoading}
                      >
                        Rebuild
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          publishRelease({ variables: { id: r.id } })
                        }
                        disabled={publishLoading}
                      >
                        <Send size={16} className="mr-1" />
                        Publish
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {r.buildError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  <strong>Build Error:</strong> {r.buildError}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {r.integrated?.slice(0, 10).map((lib) => (
                  <div
                    key={lib?.id}
                    className="bg-gray-100 border rounded-sm text-sm px-3 py-1"
                  >
                    {lib?.name}
                  </div>
                ))}
                {r.integrated?.length > 10 && (
                  <div className="bg-gray-100 border rounded-sm text-sm px-3 py-1 text-muted-foreground">
                    +{r.integrated.length - 10} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReleasesPage
