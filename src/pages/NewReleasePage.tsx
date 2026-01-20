import {
  ReleaseFileCard,
  ReleaseFontCard,
  ReleaseLibraryCard,
} from '@/components/Release'
import type { FileGroup, FontItem, LibraryGroup } from '@/components/Release'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AccordionItem } from '@radix-ui/react-accordion'
import { filesize } from 'filesize'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  ReleasesDocument,
  useCreateReleaseMutation,
  useNewReleaseQuery,
  usePotentialSavingsQuery,
} from '../../generated/graphql'

const NewReleasePage: React.FC = () => {
  const navigate = useNavigate()
  const [versionType, setVersionType] = useState<'PATCH' | 'MINOR' | 'MAJOR'>(
    'PATCH'
  )
  const { data: newReleaseQueryData } = useNewReleaseQuery()
  const { data: potentialSavingsQueryData } = usePotentialSavingsQuery()
  const [createRelease] = useCreateReleaseMutation({
    variables: { versionType },
    refetchQueries: [{ query: ReleasesDocument }],
    onCompleted: () => {
      navigate('/releases')
    },
  })

  // Merge newLibraries and libraries into unified groups
  const librariesByName = useMemo((): Map<string, LibraryGroup> => {
    const map = new Map<string, LibraryGroup>()
    const newRelease = newReleaseQueryData?.newRelease

    // Add libraries with new versions (hasChanges = true)
    for (const lib of newRelease?.newLibraries ?? []) {
      map.set(lib.name, {
        libraryName: lib.name,
        description: lib.description,
        versions: (lib.newVersions ?? []).map((v) => ({
          id: v.id,
          version: v.version,
          isNew: true,
        })),
        hasChanges: true,
      })
    }

    // Add libraries with only existing versions (hasChanges = false)
    for (const lib of newRelease?.libraries ?? []) {
      if (!map.has(lib.name)) {
        map.set(lib.name, {
          libraryName: lib.name,
          description: lib.description,
          versions: (lib.releasedVersions ?? []).map((v) => ({
            id: v.id,
            version: v.version,
            isNew: false,
          })),
          hasChanges: false,
        })
      }
    }

    // Sort versions within each group: new first, then existing
    for (const group of map.values()) {
      group.versions.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
    }

    // Sort groups: hasChanges first, then by name
    return new Map(
      [...map.entries()].sort(([, a], [, b]) => {
        if (a.hasChanges !== b.hasChanges) return a.hasChanges ? -1 : 1
        return a.libraryName.localeCompare(b.libraryName)
      })
    )
  }, [newReleaseQueryData?.newRelease])

  // Merge newFiles and files into unified groups by library
  const filesByLibrary = useMemo((): Map<string, FileGroup> => {
    const map = new Map<string, FileGroup>()
    const newRelease = newReleaseQueryData?.newRelease

    // Add new files
    for (const file of newRelease?.newFiles ?? []) {
      const name = file.version.library.name
      if (!map.has(name)) {
        map.set(name, { libraryName: name, files: [], hasChanges: true })
      }
      const group = map.get(name)!
      group.files.push({
        id: file.id,
        path: file.path,
        version: file.version.version,
        isNew: true,
      })
      group.hasChanges = true
    }

    // Add existing files
    for (const file of newRelease?.files ?? []) {
      const name = file.version.library.name
      if (!map.has(name)) {
        map.set(name, { libraryName: name, files: [], hasChanges: false })
      }
      const group = map.get(name)!
      group.files.push({
        id: file.id,
        path: file.path,
        version: file.version.version,
        isNew: false,
      })
    }

    // Sort files within each group: new first, then existing
    for (const group of map.values()) {
      group.files.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
    }

    // Sort groups: hasChanges first, then by name
    return new Map(
      [...map.entries()].sort(([, a], [, b]) => {
        if (a.hasChanges !== b.hasChanges) return a.hasChanges ? -1 : 1
        return a.libraryName.localeCompare(b.libraryName)
      })
    )
  }, [newReleaseQueryData?.newRelease])

  // Merge newFonts and fonts into unified list
  const fontsWithStatus = useMemo((): FontItem[] => {
    const fonts: FontItem[] = []
    const newRelease = newReleaseQueryData?.newRelease

    // Add new fonts
    for (const font of newRelease?.newFonts ?? []) {
      fonts.push({
        id: font.id,
        name: font.name,
        category: font.category,
        menu: font.menu,
        isNew: true,
      })
    }

    // Add existing fonts
    for (const font of newRelease?.fonts ?? []) {
      fonts.push({
        id: font.id,
        name: font.name,
        category: font.category,
        menu: font.menu,
        isNew: false,
      })
    }

    // Sort: new first, then existing
    fonts.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))

    return fonts
  }, [newReleaseQueryData?.newRelease])

  useEffect(() => {
    document.title = 'Turbine | New Release'
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">New Release</h1>
        <div className="flex items-center gap-4">
          <ToggleGroup
            type="single"
            value={versionType}
            onValueChange={(value) => {
              if (value) setVersionType(value as 'PATCH' | 'MINOR' | 'MAJOR')
            }}
          >
            <ToggleGroupItem value="PATCH">Patch</ToggleGroupItem>
            <ToggleGroupItem value="MINOR">Minor</ToggleGroupItem>
            <ToggleGroupItem value="MAJOR">Major</ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={() => createRelease()}>Create</Button>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex gap-4 mt-6">
        <Card className="p-6">
          <h4>Potential NPM Savings (weekly)</h4>
          <span className="text-3xl font-light">
            {filesize(
              potentialSavingsQueryData?.potentialSavings?.totalVersionSavings ??
                0
            )}
          </span>
        </Card>
        <Card className="p-6">
          <h4>Potential CDN Savings (weekly)</h4>
          <span className="text-3xl font-light">
            {filesize(
              potentialSavingsQueryData?.potentialSavings?.totalFileSavings ?? 0
            )}
          </span>
        </Card>
      </div>
      <Accordion type="multiple" className="mt-6">
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

        {filesByLibrary.size > 0 && (
          <AccordionItem value="files">
            <AccordionTrigger className="mx-1">
              <h2 className="text-xl font-light">Files</h2>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pb-0">
              {Array.from(filesByLibrary.values()).map((lib) => (
                <ReleaseFileCard key={lib.libraryName} fileGroup={lib} />
              ))}
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

export default NewReleasePage
