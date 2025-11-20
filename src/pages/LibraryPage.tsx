import Search from '@/components/blocks/search'
import Bandwidth from '@/components/Library/Bandwidth'
import Downloads from '@/components/Library/Downloads'
import Versions from '@/components/Library/Versions'
import { ChartBarLabelCustom } from '@/components/ui/chart-bar'
import { Icons } from '@/components/ui/icons'
import { ScriptCopyBtn } from '@/components/ui/script-copy-button'
import { Separator } from '@/components/ui/separator'
import { useFetchLibrary } from '@/hooks/useFetchLibrary'
import { useSearch } from '@/hooks/useSearch'
import { useVersions } from '@/hooks/useVersions'
import { useVersionStats } from '@/hooks/useVersionStats'
import { Link } from '@radix-ui/themes'
import { filesize } from 'filesize'
import { Globe, PackageIcon } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LibraryPageProps {}

const LibraryPage: React.FC<LibraryPageProps> = () => {
  const params = useParams<{ name: string }>()
  const { fetchLibrary, library, loading } = useFetchLibrary()
  const { versionStats, fetchVersionStats } = useVersionStats()
  const versions = useVersions(library?.versions || {})
  const [selectedVersion, setSelectedVersion] = useState<string | null>()
  const { search } = useSearch()

  useEffect(() => {
    if (params.name && !library) {
      fetchLibrary(params.name || '').then((lib) => {
        setSelectedVersion(lib['dist-tags'].latest)
        fetchVersionStats(params.name || '')
      })
    }
  }, [fetchLibrary, fetchVersionStats, library, params.name])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!library) {
    return <div>No library found with name "{params.name}"</div>
  }

  return (
    <div>
      <Search
        onChange={(res) => search(res)}
        defaultValue={library.name}
        className="mx-auto"
      />
      <div className="grid grid-cols-3 mt-6">
        <div className="col-span-2">
          <div className="flex flex-col gap-2 p-2">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-end">
                <PackageIcon className="fill-lime-400" width={32} height={32} />
                <h3 className="text-4xl">{library.name}</h3>
              </div>
              <div className="flex gap-2">
                <Link href={library.homepage} target="_blank">
                  <Globe className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                </Link>
                <Link
                  href={library.repository?.url.replace('git+', '')}
                  target="_blank"
                >
                  <Icons.gitHub className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                </Link>
                <Link
                  href={`https://npmjs.com/${library.name}`}
                  target="_blank"
                >
                  <Icons.npm className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
                </Link>
              </div>
            </div>
            <p>{library.description}</p>
            <div className="flex gap-2 text-muted-foreground">
              <span className="font-mono">{library['dist-tags'].latest}</span>
              <span className="font-mono">•</span>
              <span className="font-mono">
                Published{' '}
                {moment(library.time[library['dist-tags'].latest]).fromNow()}
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
              latest={library['dist-tags'].latest}
              onChange={setSelectedVersion}
            />
            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              commandMap={{
                npm: `npm install ${library.name}@${selectedVersion}`,
                yarn: `yarn add ${library.name}@${selectedVersion}`,
                pnpm: `pnpm add ${library.name}@${selectedVersion}`,
                bun: `bun add ${library.name}@${selectedVersion}`,
              }}
            />
          </div>
          <div className="border rounded-xl max-w-[16rem] flex flex-col gap-2 ml-8 p-4 border rounded-xl">
            <Downloads library={library.name} />
            <Bandwidth library={library.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
