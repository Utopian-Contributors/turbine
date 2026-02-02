import type { FileGroup, FontItem, LibraryGroup } from '@/components/Release'
import {
  ReleaseFileCard,
  ReleaseFontCard,
  ReleaseLibraryCard,
} from '@/components/Release'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AccordionItem } from '@radix-ui/react-accordion'
import { ArrowLeft, Download, Hammer, Send, Trash2 } from 'lucide-react'
import React, { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

import { cn } from '@/lib/utils'
import {
  NativeSupplyChainReleaseStatus,
  ReleaseDocument,
  ReleasesDocument,
  useBuildReleaseMutation,
  useDeleteReleaseMutation,
  useLoggedInQuery,
  usePublishReleaseMutation,
  useReleaseQuery,
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

const ReleaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: loggedInQueryData } = useLoggedInQuery()

  const { data, loading } = useReleaseQuery({
    variables: { id: id! },
    skip: !id,
    pollInterval: 5000,
  })

  const [buildRelease, { loading: buildLoading }] = useBuildReleaseMutation({
    refetchQueries: [{ query: ReleaseDocument, variables: { id } }],
  })
  const [publishRelease, { loading: publishLoading }] =
    usePublishReleaseMutation({
      refetchQueries: [{ query: ReleaseDocument, variables: { id } }],
    })
  const [deleteRelease, { loading: deleteLoading }] = useDeleteReleaseMutation({
    refetchQueries: [{ query: ReleasesDocument }],
    onCompleted: () => {
      navigate('/releases')
    },
  })

  const release = data?.release
  const previousRelease = release?.previousRelease

  // Build sets of previous release items for comparison
  const prevVersionKeys = useMemo(() => {
    if (!previousRelease?.integratedLibraries) return new Set<string>()
    return new Set(
      previousRelease.integratedLibraries.map(
        (v) => `${v.library.name}@${v.version}`
      )
    )
  }, [previousRelease?.integratedLibraries])

  const prevFileKeys = useMemo(() => {
    if (!previousRelease?.integratedFiles) return new Set<string>()
    return new Set(
      previousRelease.integratedFiles.map(
        (f) => `${f.version.library.name}@${f.version.version}${f.path}`
      )
    )
  }, [previousRelease?.integratedFiles])

  const prevFontNames = useMemo(() => {
    if (!previousRelease?.integratedFonts) return new Set<string>()
    return new Set(previousRelease.integratedFonts.map((f) => f.name))
  }, [previousRelease?.integratedFonts])

  // Group libraries by name with change tracking
  const librariesByName = useMemo((): Map<string, LibraryGroup> => {
    if (!release?.integratedLibraries) return new Map()
    const map = new Map<string, LibraryGroup>()
    for (const v of release.integratedLibraries) {
      const name = v.library.name
      const isNew = !prevVersionKeys.has(`${name}@${v.version}`)
      if (!map.has(name)) {
        map.set(name, { libraryName: name, versions: [], hasChanges: false })
      }
      const group = map.get(name)!
      group.versions.push({ id: v.id, version: v.version, isNew })
      if (isNew) group.hasChanges = true
    }
    // Sort versions: new first, then existing
    for (const group of map.values()) {
      group.versions.sort((a, b) =>
        a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1
      )
    }
    // Sort groups: hasChanges first, then by name
    return new Map(
      [...map.entries()].sort(([, a], [, b]) => {
        if (a.hasChanges !== b.hasChanges) return a.hasChanges ? -1 : 1
        return a.libraryName.localeCompare(b.libraryName)
      })
    )
  }, [release?.integratedLibraries, prevVersionKeys])

  // Group files by library name with change tracking
  const filesByLibrary = useMemo((): Map<string, FileGroup> => {
    if (!release?.integratedFiles) return new Map()
    const map = new Map<string, FileGroup>()
    for (const f of release.integratedFiles) {
      const name = f.version.library.name
      const key = `${name}@${f.version.version}${f.path}`
      const isNew = !prevFileKeys.has(key)
      if (!map.has(name)) {
        map.set(name, { libraryName: name, files: [], hasChanges: false })
      }
      const group = map.get(name)!
      group.files.push({
        id: f.id,
        path: f.path,
        version: f.version.version,
        isNew,
      })
      if (isNew) group.hasChanges = true
    }
    // Sort files: new first, then existing
    for (const group of map.values()) {
      group.files.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
    }
    return map
  }, [release?.integratedFiles, prevFileKeys])

  // Build fonts with isNew status
  const fontsWithStatus = useMemo((): FontItem[] => {
    if (!release?.integratedFonts) return []
    const fonts = release.integratedFonts.map((font) => ({
      id: font.id,
      name: font.name,
      category: font.category,
      isNew: !prevFontNames.has(font.name),
    }))
    // Sort: new first, then existing
    fonts.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
    return fonts
  }, [release?.integratedFonts, prevFontNames])

  useEffect(() => {
    if (release) {
      document.title = `Turbine | Release ${release.version}`
    }
  }, [release])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (!release) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <span className="text-muted-foreground">Release not found</span>
      </div>
    )
  }

  const isAdmin = loggedInQueryData?.loggedIn
  const isDevelopment =
    release.status === NativeSupplyChainReleaseStatus.Development
  const isPublished =
    release.status === NativeSupplyChainReleaseStatus.Published

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete release ${release.version}?`
      )
    ) {
      deleteRelease({ variables: { id: release.id } })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-4 -ml-2"
        onClick={() => navigate('/releases')}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Releases
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-light">{release.version}</h1>
          <Badge variant={statusBadgeVariant(release.status)}>
            {statusLabel(release.status)}
          </Badge>
        </div>
        <div className="flex gap-2">
          {release.downloadUrl && (
            <Button variant="outline" size="icon" asChild>
              <a href={release.downloadUrl} target="_blank" rel="noreferrer">
                <Download size={16} />
              </a>
            </Button>
          )}
          {isAdmin && isDevelopment && !release.downloadUrl && (
            <Button
              variant="outline"
              onClick={() => buildRelease({ variables: { id: release.id } })}
              disabled={buildLoading}
            >
              <Hammer size={16} className="mr-2" />
              {buildLoading ? 'Building...' : 'Build'}
            </Button>
          )}
          {isAdmin && isDevelopment && release.downloadUrl && (
            <>
              <Button
                variant="outline"
                onClick={() => buildRelease({ variables: { id: release.id } })}
                disabled={buildLoading}
              >
                {buildLoading ? 'Building...' : 'Rebuild'}
              </Button>
              <Button
                onClick={() =>
                  publishRelease({ variables: { id: release.id } })
                }
                disabled={publishLoading}
              >
                <Send size={16} className="mr-2" />
                {publishLoading ? 'Publishing...' : 'Publish'}
              </Button>
            </>
          )}
          {isAdmin && !isPublished && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      {release.buildError && (
        <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-700 mb-2">Build Error</h3>
          <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono">
            {release.buildError}
          </pre>
        </Card>
      )}

      {release.checksum && (
        <div className="mb-6">
          <span className="text-sm text-muted-foreground">Checksum: </span>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            {release.checksum}
          </code>
        </div>
      )}

      {release.changelog && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Changelog</h2>
          <Card className="p-4 mb-6">
            <div className="prose prose-sm max-w-none">
              {release.changelog.split('\n').map((line, i) => {
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={i} className={cn("text-lg font-semibold mb-2", i !== 0 && "mt-4")}>
                      {line.replace('### ', '')}
                    </h3>
                  )
                }
                if (line.startsWith('- ')) {
                  return (
                    <div key={i} className="flex items-start gap-2 ml-2">
                      <span className="text-muted-foreground">-</span>
                      <span>{line.replace('- ', '')}</span>
                    </div>
                  )
                }
                if (line.trim()) {
                  return <p key={i}>{line}</p>
                }
                return null
              })}
            </div>
          </Card>
        </>
      )}

      <Separator className="my-6" />

      <Accordion type="multiple" defaultValue={['libraries', 'files', 'fonts']}>
        <AccordionItem value="libraries">
          <AccordionTrigger className="mx-1">
            <h2 className="text-xl font-light">Libraries</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pb-0">
            {Array.from(librariesByName.values()).map((lib) => (
              <ReleaseLibraryCard key={lib.libraryName} library={lib} />
            ))}
            {librariesByName.size === 0 && (
              <span className="text-muted-foreground mx-1">No libraries</span>
            )}
          </AccordionContent>
        </AccordionItem>

        {(filesByLibrary.size > 0 || release.integratedFiles?.length === 0) && (
          <AccordionItem value="files">
            <AccordionTrigger className="mx-1">
              <h2 className="text-xl font-light">Files</h2>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pb-0">
              {Array.from(filesByLibrary.values()).map((lib) => (
                <ReleaseFileCard key={lib.libraryName} fileGroup={lib} />
              ))}
              {filesByLibrary.size === 0 && (
                <span className="text-muted-foreground mx-1">No files</span>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {fontsWithStatus.length > 0 && (
          <AccordionItem value="fonts">
            <AccordionTrigger className="mx-1">
              <h2 className="text-xl font-light">Fonts</h2>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pb-0">
              {fontsWithStatus.map((font) => (
                <ReleaseFontCard key={font.id} font={font} />
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

export default ReleaseDetailPage
