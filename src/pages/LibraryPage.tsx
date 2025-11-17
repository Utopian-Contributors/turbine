import Search from '@/components/blocks/search'
import Downloads from '@/components/Library/Downloads'
import Versions from '@/components/Library/Versions'
import { ScriptCopyBtn } from '@/components/ui/script-copy-button'
import { Separator } from '@/components/ui/separator'
import { useFetchLibrary } from '@/hooks/useFetchLibrary'
import { useFetchReadme } from '@/hooks/useFetchReadme'
import { useSearch } from '@/hooks/useSearch'
import { useVersions } from '@/hooks/useVersions'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LibraryPageProps {}

const LibraryPage: React.FC<LibraryPageProps> = () => {
  const params = useParams<{ name: string }>()
  const { fetchLibrary, library, loading } = useFetchLibrary()
  const versions = useVersions(library?.versions || {})
  const [selectedVersion, setSelectedVersion] = useState<string | null>()
  const { fetchReadme, readme, loading: readmeLoading } = useFetchReadme()
  const { search } = useSearch()

  useEffect(() => {
    fetchLibrary(params.name || '').then((lib) => {
      setSelectedVersion(lib['dist-tags'].latest)
    })
  }, [fetchLibrary, fetchReadme, params.name])

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
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl">{library.name}</h1>
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
          <Separator className="my-4" />
          {readmeLoading ? (
            <div>Loading README...</div>
          ) : readme ? (
            <div>
              <h2 className="text-2xl mb-2">README</h2>
              <pre className="whitespace-pre-wrap">{readme}</pre>
            </div>
          ) : (
            <div>No README found.</div>
          )}
        </div>
        <div className="col-span-1 gap-4 flex flex-col">
          <div className="hidden md:flex flex-col items-start gap-4 mx-8 p-4 border rounded-xl">
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
          <Downloads library={library.name} />
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
