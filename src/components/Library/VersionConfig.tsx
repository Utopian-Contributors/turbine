import { cn } from '@/lib/utils'
import React, { useState } from 'react'

import { type VersionConfigFragment } from '../../../generated/graphql'

const Version: React.FC<{
  version: string
  integrated?: boolean
  isAdmin?: boolean
  onClick: () => void
}> = ({ version, integrated, isAdmin, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'border rounded-sm px-2 text-md font-light',
        integrated
          ? 'border-transparent bg-green-500 text-background'
          : 'hover:shadow-xs transition-shadow duration-300 text-muted-foreground hover:text-foreground',
        isAdmin ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      {version}
    </div>
  )
}

interface VersionConfigProps {
  versionConfig?: VersionConfigFragment
  toggleIntegrateVersion: (version: string) => void
  isAdmin?: boolean
}

const VersionConfig: React.FC<VersionConfigProps> = ({
  versionConfig,
  isAdmin,
  toggleIntegrateVersion,
}) => {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <div className="self-start flex flex-flow flex-wrap gap-2 p-1">
        {versionConfig?.integrated.map((integrated) => (
          <Version
            key={integrated.id}
            version={integrated.version}
            integrated
            isAdmin={isAdmin}
            onClick={() => {
              toggleIntegrateVersion(integrated.id)
            }}
          />
        ))}
        {versionConfig?.popular.map((popular) => (
          <Version
            key={popular.id}
            version={popular.version}
            isAdmin={isAdmin}
            onClick={() => {
              toggleIntegrateVersion(popular.id)
            }}
          />
        ))}
      </div>
      {isAdmin && showAll ? (
        <button
          className="w-full cursor-pointer hover:bg-gray-100 rounded-sm text-sm text-muted-foreground hover:text-primary mt-2 py-2"
          onClick={() => setShowAll(false)}
        >
          Show Less
        </button>
      ) : isAdmin && versionConfig && versionConfig.other.length > 0 ? (
        <button
          className="w-full cursor-pointer hover:bg-gray-100 rounded-sm text-sm text-muted-foreground hover:text-primary mt-2 py-2"
          onClick={() => setShowAll(true)}
        >
          Show All Versions
        </button>
      ) : null}
      {isAdmin && showAll && versionConfig?.other.length ? (
        <div className="flex flex-col gap-2 p-2">
          <h3 className="text-md">All Versions</h3>
          <div className="flex flex-flow flex-wrap gap-2">
            {versionConfig.other.map((other) => (
              <Version
                key={other.id}
                version={other.version}
                isAdmin={isAdmin}
                onClick={() => {
                  toggleIntegrateVersion(other.id)
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default VersionConfig
