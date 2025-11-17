import { useMemo } from 'react'
import semver from 'semver'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useVersions = (versions: Record<string, any>) => {
  return useMemo(
    () =>
      Object.keys(versions)
        .map((version) => {
          if (version.includes('-')) {
            return undefined
          }
          return version
        })
        .filter(Boolean)
        .sort((a, b) => {
          const verA = semver.coerce(a!)
          const verB = semver.coerce(b!)
          if (verA && verB) {
            return semver.rcompare(verA, verB)
          }
          return 0
        })
        .reduce((all, curr) => {
          const major = curr!.split('.')[0]
          if (all && major in all) {
            all[major].push(curr!)
            return all
          }
          return { ...all, [major]: [curr!] }
        }, {} as Record<string, string[]>),
    [versions]
  )
}
