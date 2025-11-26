import { cn } from '@/lib/utils'
import React, { useState } from 'react'

import {
    LibraryDocument,
    SearchLibraryDocument,
    useIntegrateVersionMutation,
    VersionIntegrationsDocument,
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
        'rounded-full px-3 py-1 font-light',
        integrated
          ? 'bg-green-500 text-background'
          : 'border text-muted-foreground hover:text-foreground',
        isAdmin ? 'cursor-pointer hover:border-gray-400' : 'cursor-default'
      )}
    >
      {version}
    </div>
  )
}

interface VersionConfigProps {
  versionConfig?: VersionConfigFragment
  isAdmin?: boolean
  library: string
}

const VersionConfig: React.FC<VersionConfigProps> = ({
  versionConfig,
  isAdmin,
  library,
}) => {
  const [showAll, setShowAll] = useState(false)
  const [integrateVersion] = useIntegrateVersionMutation({
    refetchQueries: [
      {
        query: VersionIntegrationsDocument,
        variables: {
          library,
        },
      },
      { query: SearchLibraryDocument },
      { query: LibraryDocument, variables: { name: library } },
    ],
  })

  return (
    <div className="border rounded-xl space-y-4 p-4">
      {versionConfig?.integrated.length ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-md">Integrated</h3>
          <div className="flex flex-flow gap-1">
            {versionConfig.integrated.map((integrated) => (
              <Version
                key={integrated.id}
                version={integrated.version}
                integrated
                isAdmin={isAdmin}
                onClick={() => {
                  integrateVersion({ variables: { version: integrated.id } })
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
      {isAdmin && versionConfig?.popular.length ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-md">Popular</h3>
          <div className="flex flex-flow flex-wrap gap-1">
            {versionConfig.popular.map((popular) => (
              <Version
                key={popular.id}
                version={popular.version}
                isAdmin={isAdmin}
                onClick={() => {
                  integrateVersion({ variables: { version: popular.id } })
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
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
          <div className="flex flex-flow flex-wrap gap-1">
            {versionConfig.other.map((other) => (
              <Version
                key={other.id}
                version={other.version}
                isAdmin={isAdmin}
                onClick={() => {
                  integrateVersion({ variables: { version: other.id } })
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
