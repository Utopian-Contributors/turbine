import Search from '@/components/blocks/search'
import { useSearch } from '@/hooks/useSearch'
import React from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useBigLibrariesQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LibrariesPageProps {}

const LibrariesPage: React.FC<LibrariesPageProps> = () => {
  const { data: bigLibrariesQueryData } = useBigLibrariesQuery()
  const { search } = useSearch()

  return (
    <div className="max-w-6xl mx-auto">
      <title>Turbine | Libraries</title>
      <Search onChange={(res) => search(res)} />
      <div className="max-w-xl mx-auto flex flex-col gap-4 mt-8">
        {bigLibrariesQueryData?.bigLibraries?.map((lib) => {
          return (
            <Link
              key={lib.id}
              to={`/l/${encodeURIComponent(lib.name)}`}
              className={cn(
                'cursor-pointer hover:shadow-md transition-shadow duration-300 border rounded-lg p-4',
                lib.integrated
                  ? 'hover:bg-green-200/10 hover:border-green-400 transition-all'
                  : undefined
              )}
            >
              <h2 className="text-lg">{lib.name}</h2>
              <p className="text-md truncate text-muted-foreground">
                {lib.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default LibrariesPage
