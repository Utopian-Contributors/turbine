import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import React, { useMemo, useState } from 'react'
import {
    LibraryDocument,
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
  const bandwidthPercent = useMemo(() => {
    let zeros = 0
    const percent = (Number(bandwidth) / totalBandwidth) * 100
    for (let i = 0; i < String(percent).length; i++) {
      if (String(percent)[i] === '.') {
        continue
      }
      if (String(percent)[i] === '0') {
        zeros++
      } else {
        break
      }
    }
    return percent > 1 ? percent.toFixed(2) : percent.toFixed(zeros + 1)
  }, [bandwidth, totalBandwidth])
  return (
    <div
      key={file.id}
      className={cn(
        'w-full flex items-center p-2 transition-all duration-200',
        file.integrated ? undefined : 'opacity-40 hover:opacity-100',
        isAdmin ? 'cursor-pointer hover:bg-gray-100 rounded-sm ' : undefined
      )}
      onClick={() => {
        if (isAdmin) toggleIntegrate({ variables: { versionFile: file.id } })
      }}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{file.path}</span>
            <span className="text-xs text-muted-foreground">
              {file.version.version}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">
              {filesize(bandwidth)}
            </span>
            <span className="text-sm">{bandwidthPercent}%</span>
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
    refetchQueries: [VersionFilesDocument, LibraryDocument],
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
    <div className="flex flex-col">
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
            className="w-full cursor-pointer hover:bg-gray-100 rounded-sm text-sm text-muted-foreground hover:text-primary mt-2 py-2"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        ) : isAdmin ? (
          <button
            className="w-full cursor-pointer hover:bg-gray-100 rounded-sm text-sm text-muted-foreground hover:text-primary mt-2 py-2"
            onClick={() => setShowAll(true)}
          >
            Show All Files
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default VersionFileConfig
