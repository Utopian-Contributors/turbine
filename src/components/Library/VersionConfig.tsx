import { cn } from '@/lib/utils'
import React, { useState } from 'react'

import {
    useToggleIntegrateVersionMutation,
    type VersionConfigFragment,
} from '../../../generated/graphql'

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
  toggleIntegrateVersion: ReturnType<
    typeof useToggleIntegrateVersionMutation
  >[0]
  isAdmin?: boolean
}

const VersionConfig: React.FC<VersionConfigProps> = ({
  versionConfig,
  isAdmin,
  toggleIntegrateVersion,
}) => {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="border rounded-xl space-y-4 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg">Popular Versions</h2>
        <div className="flex flex-flow flex-wrap gap-2">
          {versionConfig?.integrated.map((integrated) => (
            <Version
              key={integrated.id}
              version={integrated.version}
              integrated
              isAdmin={isAdmin}
              onClick={() => {
                toggleIntegrateVersion({
                  variables: { version: integrated.id },
                })
              }}
            />
          ))}
          {versionConfig?.popular.map((popular) => (
            <Version
              key={popular.id}
              version={popular.version}
              isAdmin={isAdmin}
              onClick={() => {
                toggleIntegrateVersion({ variables: { version: popular.id } })
              }}
            />
          ))}
        </div>
      </div>
      {isAdmin && showAll ? (
        <button
          className="cursor-pointer text-sm underline"
          onClick={() => setShowAll(false)}
        >
          Show Less
        </button>
      ) : isAdmin && versionConfig && versionConfig.other.length > 0 ? (
        <button
          className="cursor-pointer text-sm underline"
          onClick={() => setShowAll(true)}
        >
          Show All Versions
        </button>
      ) : null}
      {isAdmin && showAll && versionConfig?.other.length ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-md">All Versions</h3>
          <div className="flex flex-flow flex-wrap gap-2">
            {versionConfig.other.map((other) => (
              <Version
                key={other.id}
                version={other.version}
                isAdmin={isAdmin}
                onClick={() => {
                  toggleIntegrateVersion({ variables: { version: other.id } })
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
