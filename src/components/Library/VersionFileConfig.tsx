import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import React, { useMemo, useState } from 'react'
import {
    useToggleIntegrateVersionFileMutation,
    VersionFilesDocument,
    type ToggleIntegrateVersionFileMutationFn,
    type Version,
    type VersionFileConfigFragment,
    type VersionFile as VersionFileType,
} from '../../../generated/graphql'
import { Progress } from '../ui/progress'

interface VersionFileConfigProps {
  versionFileConfig?: VersionFileConfigFragment
  totalBandwidth: number
  isAdmin?: boolean
}

const VersionFile: React.FC<{
  file: Pick<VersionFileType, 'id' | 'path' | 'integrated'> & {
    version: Pick<Version, 'version'>
  }
  bandwidth: string
  totalBandwidth: number
  isAdmin?: boolean
  toggleIntegrate: ToggleIntegrateVersionFileMutationFn
}> = ({ file, bandwidth, totalBandwidth, isAdmin, toggleIntegrate }) => {
  return (
    <div
      key={file.id}
      className="cursor-pointer hover:bg-gray-100 rounded-sm w-full flex items-center p-2"
      onClick={() => {
        if (isAdmin) toggleIntegrate({ variables: { versionFile: file.id } })
      }}
    >
      <div className="group w-full flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{file.path}</span>
            <span className="text-xs text-muted-foreground">
              {file.version.version}
            </span>
            {isAdmin && (
              <div className="hidden group-hover:inline text-xs text-gray-300">
                {file.integrated ? 'Click to remove' : 'Click to add'}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">{filesize(bandwidth)}</span>
            <span className="text-sm">
              {((Number(bandwidth) / totalBandwidth) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <Progress
          progressClassName={cn(file.integrated ? 'bg-green-500' : undefined)}
          className={cn(file.integrated ? 'bg-green-600/20' : undefined)}
          value={(Number(bandwidth) / totalBandwidth) * 100}
        />
      </div>
    </div>
  )
}

const VersionFileConfig: React.FC<VersionFileConfigProps> = ({
  versionFileConfig,
  totalBandwidth,
  isAdmin,
}) => {
  const [toggleIntegrate] = useToggleIntegrateVersionFileMutation({
    refetchQueries: [VersionFilesDocument],
  })
  const [showAll, setShowAll] = useState(false)

  const popular = useMemo(() => {
    return (
      (versionFileConfig?.integrated.length ?? 0) < 5 &&
      versionFileConfig?.popular
        .filter(
          ({ file }) =>
            !versionFileConfig?.integrated.some(
              (integrated) => integrated.file.id === file.id
            )
        )
        .slice(
          0,
          showAll ? undefined : 5 - (versionFileConfig?.integrated.length ?? 0)
        )
        .map(({ file, bandwidth }) => (
          <VersionFile
            key={file.id}
            bandwidth={bandwidth}
            file={file}
            totalBandwidth={totalBandwidth}
            isAdmin={isAdmin}
            toggleIntegrate={toggleIntegrate}
          />
        ))
    )
  }, [
    versionFileConfig?.integrated,
    versionFileConfig?.popular,
    showAll,
    totalBandwidth,
    isAdmin,
    toggleIntegrate,
  ])

  return (
    <div className="bg-gradient-to-t from-primary/2 to-card mt-4 border rounded-xl flex flex-col p-2 pb-6">
      <h3 className="p-2">Popular CDN files</h3>
      <div className="flex flex-col">
        {versionFileConfig?.integrated.map(({ file, bandwidth }) => (
          <VersionFile
            key={file.id}
            bandwidth={bandwidth}
            file={file}
            totalBandwidth={totalBandwidth}
            isAdmin={isAdmin}
            toggleIntegrate={toggleIntegrate}
          />
        ))}
        {popular}
        {isAdmin && showAll ? (
          <button
            className="cursor-pointer text-sm underline mt-2"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        ) : isAdmin ? (
          <button
            className="cursor-pointer text-sm underline mt-2"
            onClick={() => setShowAll(true)}
          >
            Show All Versions
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default VersionFileConfig
