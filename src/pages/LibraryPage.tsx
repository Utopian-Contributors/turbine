import Search from '@/components/blocks/search'
import Bandwidth from '@/components/Library/Bandwidth'
import Downloads from '@/components/Library/Downloads'
import Versions from '@/components/Library/Versions'
import { Icons } from '@/components/ui/icons'
import { ScriptCopyBtn } from '@/components/ui/script-copy-button'
import { Separator } from '@/components/ui/separator'
import { useSearch } from '@/hooks/useSearch'
import { useVersions } from '@/hooks/useVersions'
import { filesize } from 'filesize'
import { Globe, PackageIcon } from 'lucide-react'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import VersionFilesCard from '@/components/Library/VersionFilesCard'
import VersionsCard from '@/components/Library/VersionsCard'
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
  const [selectedFileVersion, setSelectedFileVersion] = useState<
    string | null
  >()

  useEffect(() => {
    if (!selectedVersion) {
      setSelectedVersion(libraryQueryData?.library?.lastVersion?.version)
    }
    if (versionIntegrationsQueryData?.versionIntegrations?.popular.length) {
      versionFilesQuery().then((versionFilesQueryData) => {
        setSelectedFileVersion(
          versionFilesQueryData.data?.versionFileIntegrations.integrated[0].file
            .version.version || null
        )
      })
    }
  }, [
    libraryQueryData?.library,
    params.name,
    selectedVersion,
    versionFilesQuery,
    versionIntegrationsQueryData?.versionIntegrations?.popular.length,
  ])

  const title = useMemo(() => {
    if (libraryQueryData?.library?.name) {
      return `Turbine | ${libraryQueryData?.library?.name}`
    } else {
      return 'Turbine | Library'
    }
  }, [libraryQueryData?.library?.name])

  const toggleIntegrate = useCallback(
    async (version: string) => {
      if (loggedInQueryData?.loggedIn?.role !== Role.Admin) {
        return
      }
      await toggleIntegrateVersion({
        variables: {
          version,
        },
      })
    },
    [toggleIntegrateVersion, loggedInQueryData?.loggedIn?.role]
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (!libraryQueryData?.library) {
    return <div>No library found with name "{params.name}"</div>
  }

  return (
    <div className="w-full lg:max-w-6xl mx-auto p-6">
      <title>{title}</title>
      <Search
        placeholder="Search npm packages"
        onChange={(q) => search(q)}
        defaultValue={libraryQueryData?.library.name}
      />
      <div className="flex flex-col lg:grid lg:grid-cols-3 mt-6">
        <div className="lg:col-span-2">
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
          {versionIntegrationsQueryData &&
            versionIntegrationsQueryData?.versionIntegrations && (
              <VersionsCard
                integrations={versionIntegrationsQueryData.versionIntegrations}
                usage={versionUsageQueryData?.versionUsage}
                isAdmin={loggedInQueryData?.loggedIn.role === Role.Admin}
                toggleIntegrateVersion={toggleIntegrate}
              />
            )}
          {versionFilesQueryData?.versionFileIntegrations && (
            <VersionFilesCard
              integrations={versionFilesQueryData?.versionFileIntegrations}
              usage={libraryUsageQueryData?.libraryUsage}
              selected={selectedFileVersion}
              setSelected={(version) => setSelectedFileVersion(version)}
              isAdmin={loggedInQueryData?.loggedIn.role === Role.Admin}
              library={libraryQueryData?.library.name || ''}
            />
          )}
        </div>
        <div className="w-full lg:w-fit lg:col-span-1 gap-4 flex flex-col">
          <div className="w-full lg:w-fit bg-gradient-to-t from-primary/2 to-card border rounded-xl flex flex-col gap-2 mt-4 lg:mt-0 lg:mx-8 p-4">
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
          {libraryUsageQueryData?.libraryUsage?.downloads &&
            libraryUsageQueryData.libraryUsage.bandwidth && (
              <div className="w-full lg:w-fit bg-gradient-to-t from-primary/2 to-card border rounded-xl lg:max-w-[16rem] flex flex-col gap-2 lg:ml-8 p-4 border rounded-xl">
                <Downloads
                  library={libraryQueryData?.library.name || ''}
                  downloads={
                    libraryUsageQueryData?.libraryUsage?.downloads || ''
                  }
                  prevDownloads={
                    libraryUsageQueryData?.libraryUsage?.prev?.downloads || ''
                  }
                />
                <Bandwidth
                  library={libraryQueryData?.library.name || ''}
                  usage={libraryUsageQueryData?.libraryUsage?.bandwidth}
                  prevUsage={
                    libraryUsageQueryData?.libraryUsage?.prev?.bandwidth
                  }
                />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
