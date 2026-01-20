import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router'

import { type LibraryGroup } from './types'

interface ReleaseLibraryCardProps {
  library: LibraryGroup
}

export function ReleaseLibraryCard({ library }: ReleaseLibraryCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate('/l/' + library.libraryName)}
      className={cn(
        'cursor-pointer hover:opacity-100 hover:shadow-md border rounded-md mx-1 p-4',
        !library.hasChanges && 'opacity-60'
      )}
    >
      <h3 className="text-lg font-medium">{library.libraryName}</h3>
      {library.description && (
        <p className="text-sm text-gray-500">{library.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {library.versions.map((v) => (
          <div
            key={v.id}
            className={cn(
              'rounded-md px-2 py-1',
              v.isNew ? 'bg-green-100' : 'bg-gray-100'
            )}
          >
            {v.version}
          </div>
        ))}
      </div>
    </div>
  )
}
