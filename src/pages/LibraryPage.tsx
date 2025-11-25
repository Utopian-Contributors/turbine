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
import { useVersionStats } from '@/hooks/useVersionStats'
import { Link } from '@radix-ui/themes'
import { filesize } from 'filesize'
import { Globe, PackageIcon } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { cn } from '@/lib/utils'
import { useLibraryQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LibraryPageProps {}

const LibraryPage: React.FC<LibraryPageProps> = () => {
  const params = useParams<{ name: string }>()
  const { data: libraryQueryData, loading } = useLibraryQuery({
    variables: { name: params.name || '' },
  })
  const { versionStats, fetchVersionStats } = useVersionStats()
  const versions = useVersions(libraryQueryData?.library?.versions ?? [])
  const [selectedVersion, setSelectedVersion] = useState<string | null>()
  const { search } = useSearch()

  useEffect(() => {
    if (!selectedVersion) {
      setSelectedVersion(libraryQueryData?.library?.lastVersion?.version)
    }
    if (params.name && !libraryQueryData?.library && !versionStats) {
      fetchVersionStats(params.name || '')
    }
  }, [
    fetchVersionStats,
    libraryQueryData?.library,
    params.name,
    selectedVersion,
    versionStats,
  ])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!libraryQueryData?.library) {
    return <div>No library found with name "{params.name}"</div>
  }

  return (
    <div>
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
                    'stroke-1',
                    libraryQueryData.library.integrated
                      ? 'fill-green-500'
                      : 'fill-amber-300'
                  )}
                  width={32}
                  height={32}
                />
                <h3 className="text-4xl">{libraryQueryData?.library.name}</h3>
              </div>
              <div className="flex gap-2">
                <Link
                  href={libraryQueryData?.library.homepage ?? ''}
                  target="_blank"
                >
                  <Globe className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                </Link>
                <Link
                  href={libraryQueryData?.library.repository?.replace(
                    'git+',
                    ''
                  )}
                  target="_blank"
                >
                  <Icons.gitHub className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                </Link>
                <Link
                  href={`https://npmjs.com/${libraryQueryData?.library.name}`}
                  target="_blank"
                >
                  <Icons.npm className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                </Link>
              </div>
            </div>
            <p>{libraryQueryData?.library.description}</p>
            <div className="flex gap-2 text-muted-foreground">
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
            </div>
          </div>
          <Separator className="my-6" />
          {versionStats ? (
            <ChartBarLabelCustom
              classname="mt-4"
              label="Popular versions"
              description="Top 10 versions by bandwidth usage in the last week"
              data={versionStats.map((stat) => ({
                label: stat.version,
                value: stat.bandwidth,
                formattedValue: filesize(stat.bandwidth),
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
          <div className="border rounded-xl flex flex-col gap-2 mx-8 p-4">
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
          <div className="border rounded-xl max-w-[16rem] flex flex-col gap-2 ml-8 p-4 border rounded-xl">
            <Downloads library={libraryQueryData?.library.name || ''} />
            <Bandwidth library={libraryQueryData?.library.name || ''} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
