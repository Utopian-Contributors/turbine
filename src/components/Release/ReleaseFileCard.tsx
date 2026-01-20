import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router'

import { FileGroup } from './types'

interface ReleaseFileCardProps {
  fileGroup: FileGroup
}

export function ReleaseFileCard({ fileGroup }: ReleaseFileCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate('/l/' + fileGroup.libraryName)}
      className={cn(
        'cursor-pointer hover:opacity-100 hover:shadow-md border rounded-md mx-1 p-4',
        !fileGroup.hasChanges && 'opacity-60'
      )}
    >
      <h3 className="text-lg font-medium">{fileGroup.libraryName}</h3>
      <div className="flex flex-col gap-1 mt-2">
        {fileGroup.files.map((file) => (
          <div key={file.id} className="text-sm text-gray-500">
            <span
              className={cn(
                'rounded-md px-2 py-0.5 mr-2',
                file.isNew ? 'bg-green-100' : 'bg-gray-100'
              )}
            >
              {file.version}
            </span>
            {file.path}
          </div>
        ))}
      </div>
    </div>
  )
}
