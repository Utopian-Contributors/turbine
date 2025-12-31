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
import {
  Check,
  ChevronsUpDown,
  Globe,
  PackageIcon,
  Save,
  Trash,
} from 'lucide-react'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import VersionFilesCard from '@/components/Library/VersionFilesCard'
import VersionsCard from '@/components/Library/VersionsCard'
import AutoProgress from '@/components/ui/auto-progress'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toHeaderCase } from 'js-convert-case'
import {
  LibraryDocument,
  Role,
  SearchLibraryDocument,
  useAddSubpathMutation,
  useDeleteSubpathMutation,
  useEditSameVersionRequirementMutation,
  useEditSubpathMutation,
  useLibraryQuery,
  useLibraryUsageQuery,
  useLoggedInQuery,
  useSearchLibraryLazyQuery,
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

  const [searchLibraries, { data: searchLibrariesData }] =
    useSearchLibraryLazyQuery()
  const { data: libraryQueryData, loading } = useLibraryQuery({
    variables: { name: params.name || '' },
  })
  const [editSameVersionRequirement] = useEditSameVersionRequirementMutation()
  const [openSameVersionPopover, setOpenSameVersionPopover] = useState(false)
  const [sameVersion, setSameVersion] = useState<string | null>(
    libraryQueryData?.library?.sameVersionRequirement?.dependingOn.name || null
  )

  const [subpaths, setSubpaths] = useState<
    {
      id: string
      path: string
      since?: string
    }[]
  >([])
  const [newSubpath, setNewSubpath] = useState<{
    path: string
    since?: string
  }>({ path: '', since: undefined })
  const [editSubpath] = useEditSubpathMutation()
  const [addSubpath] = useAddSubpathMutation({
    refetchQueries: [
      { query: LibraryDocument, variables: { name: params.name || '' } },
    ],
  })
  const [deleteSubpath] = useDeleteSubpathMutation({
    refetchQueries: [
      { query: LibraryDocument, variables: { name: params.name || '' } },
    ],
  })

  const { data: libraryUsageQueryData, refetch: refetchLibraryUsage } =
    useLibraryUsageQuery({
      variables: { name: params.name || '' },
    })
  const { data: versionUsageQueryData, refetch: refetchVersionUsage } =
    useVersionUsageQuery({
      variables: { library: params.name || '' },
    })
  const {
    data: versionIntegrationsQueryData,
    refetch: refetchVersionIntegrations,
  } = useVersionIntegrationsQuery({
    variables: { library: params.name || '' },
  })
  const [
    versionFilesQuery,
    { data: versionFilesQueryData, refetch: refetchVersionFiles },
  ] = useVersionFilesLazyQuery({
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

  useEffect(() => {
    document.title = title
  }, [title])

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

  const loadingUsage = useMemo(() => {
    if (!libraryUsageQueryData || !libraryUsageQueryData.libraryUsage) {
      setTimeout(() => {
        refetchLibraryUsage()
        refetchVersionUsage()
        refetchVersionIntegrations()
        refetchVersionFiles()
      }, 5000)
      return true
    }
  }, [
    libraryUsageQueryData,
    refetchLibraryUsage,
    refetchVersionFiles,
    refetchVersionIntegrations,
    refetchVersionUsage,
  ])

  useEffect(() => {
    if (
      !sameVersion &&
      libraryQueryData?.library?.sameVersionRequirement?.dependingOn.name
    ) {
      setSameVersion(
        libraryQueryData.library.sameVersionRequirement.dependingOn.name
      )
    }
    if (!subpaths.length && libraryQueryData?.library?.subpaths) {
      setSubpaths(
        libraryQueryData.library.subpaths.map((sp) => ({
          id: sp.id,
          path: sp.path,
          since: sp.since?.version,
        }))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    libraryQueryData?.library?.sameVersionRequirement?.dependingOn.name,
    libraryQueryData?.library?.subpaths,
    libraryQueryData?.library?.subpaths.length,
    sameVersion,
  ])

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
          {loggedInQueryData?.loggedIn.role === Role.Admin && (
            <Card className="w-full flex flex-row justify-between items-center mb-4 p-6">
              <span>Same Version Requirement</span>
              <Popover
                open={openSameVersionPopover}
                onOpenChange={setOpenSameVersionPopover}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSameVersionPopover}
                    className="w-[200px] text-md justify-between"
                  >
                    {sameVersion
                      ? toHeaderCase(sameVersion)
                      : 'Select framework...'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                      onValueChange={(search) =>
                        searchLibraries({ variables: { term: search } })
                      }
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {searchLibrariesData?.searchLibrary?.map((library) => (
                          <CommandItem
                            key={library.name}
                            value={library.name}
                            onSelect={(currentValue) => {
                              setSameVersion(
                                currentValue === sameVersion ? '' : currentValue
                              )
                              if (libraryQueryData.library?.name) {
                                editSameVersionRequirement({
                                  variables: {
                                    library: libraryQueryData.library.name,
                                    dependingOn: currentValue,
                                  },
                                })
                              }
                              setOpenSameVersionPopover(false)
                            }}
                          >
                            {library.name}
                            <Check
                              className={cn(
                                'ml-auto',
                                sameVersion === library.name
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Card>
          )}
          {loggedInQueryData?.loggedIn.role === Role.Admin && (
            <Card className="w-full mb-4 p-6">
              {subpaths.length > 0 && (
                <div className="flex flex-col gap-4 mb-4">
                  {subpaths.map((subpath) => (
                    <div className="flex gap-4 items-start">
                      <Label
                        htmlFor="path"
                        className="text-muted-foreground flex flex-col gap-2"
                      >
                        Subpath
                        <Input
                          id="path"
                          placeholder="/"
                          className="w-fit"
                          value={subpath.path}
                          onChange={(e) => {
                            setSubpaths(() =>
                              subpaths.map((sp) => {
                                if (sp.path === subpath.path) {
                                  return { ...sp, path: e.target.value }
                                }
                                return sp
                              })
                            )
                          }}
                        />
                      </Label>
                      <Label
                        htmlFor="since"
                        className="text-muted-foreground flex flex-col gap-2"
                      >
                        Since Version
                        <Select
                          value={subpath.since}
                          onValueChange={(value) => {
                            setSubpaths(() =>
                              subpaths.map((sp) => {
                                if (sp.path === subpath.path) {
                                  return { ...sp, since: value }
                                }
                                return sp
                              })
                            )
                          }}
                        >
                          <SelectTrigger id="since" className="max-w-48">
                            {subpath.since || 'Version'}
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(versions)
                              .sort((a, b) => parseInt(b) - parseInt(a))
                              .map((major) => [
                                <SelectGroup key={major}>
                                  <SelectLabel>Version {major}</SelectLabel>
                                  {versions[major].map((version: string) => (
                                    <SelectItem key={version} value={version}>
                                      {version}{' '}
                                      {version ===
                                      libraryQueryData.library?.lastVersion
                                        ?.version
                                        ? '(latest)'
                                        : ''}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>,
                                <SelectSeparator key={`separator-${major}`} />,
                              ])}
                          </SelectContent>
                        </Select>
                      </Label>
                      <Button
                        size="icon"
                        variant="outline"
                        className="self-end"
                        onClick={() => {
                          deleteSubpath({ variables: { subpath: subpath.id } })
                          setSubpaths(() =>
                            subpaths.filter((sp) => sp.id !== subpath.id)
                          )
                        }}
                      >
                        <Trash size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-4 mb-4">
                <Label
                  htmlFor="path"
                  className="text-muted-foreground flex flex-col gap-2"
                >
                  New Subpath
                  <Input
                    id="path"
                    placeholder="/"
                    className="w-fit"
                    value={newSubpath.path}
                    onChange={(e) => {
                      setNewSubpath({
                        ...newSubpath,
                        path: e.target.value,
                      })
                    }}
                  />
                </Label>
                <Label
                  htmlFor="since"
                  className="text-muted-foreground flex flex-col gap-2"
                >
                  Since Version
                  <Select
                    onValueChange={(value) => {
                      setNewSubpath({ ...newSubpath, since: value })
                    }}
                  >
                    <SelectTrigger id="since" className="max-w-48">
                      {newSubpath.since ||
                        libraryQueryData.library?.lastVersion?.version ||
                        'Version'}
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(versions)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .map((major) => [
                          <SelectGroup key={major}>
                            <SelectLabel>Version {major}</SelectLabel>
                            {versions[major].map((version: string) => (
                              <SelectItem key={version} value={version}>
                                {version}{' '}
                                {version ===
                                libraryQueryData.library?.lastVersion?.version
                                  ? '(latest)'
                                  : ''}
                              </SelectItem>
                            ))}
                          </SelectGroup>,
                          <SelectSeparator key={`separator-${major}`} />,
                        ])}
                    </SelectContent>
                  </Select>
                </Label>
              </div>
              <Button
                variant="outline"
                className="flex gap-2"
                onClick={() => {
                  if (
                    libraryQueryData.library?.name &&
                    newSubpath?.path &&
                    newSubpath.since
                  ) {
                    addSubpath({
                      variables: {
                        library: libraryQueryData.library?.name,
                        path: newSubpath.path,
                        since: newSubpath.since,
                      },
                    })
                    setNewSubpath({ path: '', since: undefined })
                  }
                  for (const subpath of subpaths) {
                    if (
                      libraryQueryData.library?.subpaths.find(
                        (sp) => sp.id === subpath.id
                      )
                    ) {
                      editSubpath({
                        variables: {
                          subpath: subpath.id,
                          path: subpath.path,
                          since: subpath.since,
                        },
                      })
                    }
                  }
                }}
              >
                <Save size={16} />
                Save
              </Button>
            </Card>
          )}
          {loadingUsage ? (
            <div className="w-full flex flex-col items-center mb-4">
              <div className="animate-pulse mb-4">Loading stats...</div>
              <AutoProgress />
            </div>
          ) : null}
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
