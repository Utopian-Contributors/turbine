import Search from '@/components/blocks/search'
import Bandwidth from '@/components/Library/Bandwidth'
import Downloads from '@/components/Library/Downloads'
import Versions from '@/components/Library/Versions'
import { ChartBarLabelCustom } from '@/components/ui/chart-bar'
import { Icons } from '@/components/ui/icons'
import { ScriptCopyBtn } from '@/components/ui/script-copy-button'
import { Separator } from '@/components/ui/separator'
import { useSearch } from '@/hooks/useSearch'
import { useVersions } from '@/hooks/useVersions'
import { filesize } from 'filesize'
import { Globe, PackageIcon } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import VersionConfig from '@/components/Library/VersionConfig'
import VersionFileConfig from '@/components/Library/VersionFileConfig'
import { cn } from '@/lib/utils'
import {
  LibraryDocument,
  Role,
  SearchLibraryDocument,
  useLibraryQuery,
  useLibraryUsageQuery,
  useLoggedInQuery,
  useToggleIntegrateVersionMutation,
  useVersionFilesLazyQuery,
  useVersionIntegrationsQuery,
  useVersionUsageQuery,
  VersionIntegrationsDocument,
  VersionUsageDocument,
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LibraryPageProps {}

const LibraryPage: React.FC<LibraryPageProps> = () => {
  const params = useParams<{ name: string }>()
  const { data: libraryQueryData, loading } = useLibraryQuery({
    variables: { name: params.name || '' },
  })
  const { data: libraryUsageQueryData } = useLibraryUsageQuery({
    variables: { name: params.name || '' },
  })
  const { data: versionUsageQueryData } = useVersionUsageQuery({
    variables: { library: params.name || '' },
  })
  const { data: versionIntegrationsQueryData } = useVersionIntegrationsQuery({
    variables: { library: params.name || '' },
  })
  const [versionFilesQuery, { data: versionFilesQueryData }] =
    useVersionFilesLazyQuery({
      variables: { library: params.name || '' },
    })
  const [toggleIntegrateVersion] = useToggleIntegrateVersionMutation({
    refetchQueries: [
      {
        query: VersionIntegrationsDocument,
        variables: {
          library: params.name || '',
        },
      },
      { query: SearchLibraryDocument },
      {
        query: VersionUsageDocument,
        variables: { library: params.name || '' },
      },
      { query: LibraryDocument, variables: { name: params.name || '' } },
    ],
    awaitRefetchQueries: true,
  })
  const { data: loggedInQueryData } = useLoggedInQuery()
  const { search } = useSearch()

  const versions = useVersions(libraryQueryData?.library?.versions ?? [])
  const [selectedVersion, setSelectedVersion] = useState<string | null>()
  useEffect(() => {
    if (!selectedVersion) {
      setSelectedVersion(libraryQueryData?.library?.lastVersion?.version)
    }
    if (versionIntegrationsQueryData?.versionIntegrations?.popular.length) {
      versionFilesQuery()
    }
  }, [
    libraryQueryData?.library,
    params.name,
    selectedVersion,
    versionFilesQuery,
    versionIntegrationsQueryData?.versionIntegrations?.popular.length,
  ])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!libraryQueryData?.library) {
    return <div>No library found with name "{params.name}"</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Search
        onChange={(q) => search(q)}
        defaultValue={libraryQueryData?.library.name}
      />
      <div className="grid grid-cols-3 mt-6">
        <div className="col-span-2">
          <div className="flex flex-col gap-2 p-2">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-end">
                <PackageIcon
                  className={cn(
                    'stroke-[1.5]',
                    libraryQueryData.library.integrated
                      ? 'text-green-800 fill-green-500'
                      : 'fill-gray-200'
                  )}
                  width={32}
                  height={32}
                />
                <h1 className="text-3xl">{libraryQueryData?.library.name}</h1>
              </div>
              <div className="flex gap-2">
                {libraryQueryData.library.homepage && (
                  <Link
                    to={libraryQueryData?.library.homepage ?? ''}
                    target="_blank"
                  >
                    <Globe className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                  </Link>
                )}
                {libraryQueryData?.library.repository && (
                  <Link
                    to={libraryQueryData?.library.repository?.replace(
                      'git+',
                      ''
                    )}
                    target="_blank"
                  >
                    <Icons.gitHub className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                  </Link>
                )}
                <Link
                  to={`https://npmjs.com/${libraryQueryData?.library.name}`}
                  target="_blank"
                >
                  <Icons.npm className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                </Link>
              </div>
            </div>
            <p>{libraryQueryData?.library.description}</p>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span className="font-mono">
                {libraryQueryData?.library.lastVersion?.version}
              </span>
              <span className="font-mono">•</span>
              <span className="font-mono">
                Published{' '}
                {moment(
                  libraryQueryData?.library.lastVersion?.publishedAt
                ).fromNow()}
              </span>
              <span className="font-mono">•</span>
              {libraryQueryData?.library.lastVersion?.size && (
                <span className="font-mono">
                  {filesize(libraryQueryData?.library.lastVersion?.size)}
                </span>
              )}
            </div>
          </div>
          <Separator className="my-6" />
          {(versionIntegrationsQueryData?.versionIntegrations.integrated
            .length ||
            loggedInQueryData?.loggedIn.role === Role.Admin) && (
            <VersionConfig
              toggleIntegrateVersion={toggleIntegrateVersion}
              isAdmin={loggedInQueryData?.loggedIn.role === Role.Admin}
              versionConfig={versionIntegrationsQueryData?.versionIntegrations}
            />
          )}
          {versionFilesQueryData?.versionFileIntegrations &&
          libraryUsageQueryData?.libraryUsage?.bandwidth.total ? (
            <VersionFileConfig
              versionFileConfig={versionFilesQueryData?.versionFileIntegrations}
              totalBandwidth={Number(
                libraryUsageQueryData?.libraryUsage?.bandwidth.total
              )}
              isAdmin={loggedInQueryData?.loggedIn.role === Role.Admin}
            />
          ) : null}
          {versionUsageQueryData?.versionUsage ? (
            <ChartBarLabelCustom
              classname="bg-gradient-to-t from-primary/2 to-card mt-4"
              description="Top 10 versions by bandwidth usage in the last week"
              data={versionUsageQueryData?.versionUsage.map((stat) => ({
                label: stat.version,
                value: Number(stat.bandwidth),
                formattedValue: filesize(Number(stat.bandwidth)),
                fill: stat.integrated
                  ? 'var(--color-green-500)'
                  : 'var(--color-gray-500)',
              }))}
              config={{
                value: {
                  label: 'Bandwidth',
                  color: 'gray',
                },
                label: {
                  color: 'var(--background)',
                },
              }}
            />
          ) : null}
        </div>
        <div className="col-span-1 gap-4 flex flex-col">
          <div className="bg-gradient-to-t from-primary/2 to-card border rounded-xl flex flex-col gap-2 mx-8 p-4">
            <Versions
              versions={versions}
              selected={selectedVersion}
              latest={libraryQueryData?.library.lastVersion?.version || ''}
              onChange={setSelectedVersion}
            />
            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              commandMap={{
                npm: `npm install ${libraryQueryData?.library.name}@${selectedVersion}`,
                yarn: `yarn add ${libraryQueryData?.library.name}@${selectedVersion}`,
                pnpm: `pnpm add ${libraryQueryData?.library.name}@${selectedVersion}`,
                bun: `bun add ${libraryQueryData?.library.name}@${selectedVersion}`,
              }}
            />
          </div>
          <div className="bg-gradient-to-t from-primary/2 to-card border rounded-xl max-w-[16rem] flex flex-col gap-2 ml-8 p-4 border rounded-xl">
            <Downloads
              library={libraryQueryData?.library.name || ''}
              downloads={libraryUsageQueryData?.libraryUsage?.downloads || ''}
              prevDownloads={
                libraryUsageQueryData?.libraryUsage?.prev?.downloads || ''
              }
            />
            <Bandwidth
              library={libraryQueryData?.library.name || ''}
              usage={libraryUsageQueryData?.libraryUsage?.bandwidth}
              prevUsage={libraryUsageQueryData?.libraryUsage?.prev?.bandwidth}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
