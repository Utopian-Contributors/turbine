export type VersionItem = { id: string; version: string; isNew: boolean }
export type LibraryGroup = {
  libraryName: string
  description?: string | null
  versions: VersionItem[]
  hasChanges: boolean
}

export type FileItem = { id: string; path: string; version: string; isNew: boolean }
export type FileGroup = {
  libraryName: string
  files: FileItem[]
  hasChanges: boolean
}

export type FontItem = {
  id: string
  name: string
  category: string
  menu?: string | null
  isNew: boolean
}
