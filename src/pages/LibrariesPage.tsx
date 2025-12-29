import Search from '@/components/blocks/search'
import { useSearch } from '@/hooks/useSearch'
import React from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { PackageIcon } from 'lucide-react'
import { useBigLibrariesQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LibrariesPageProps {}

const LibrariesPage: React.FC<LibrariesPageProps> = () => {
  const { data: bigLibrariesQueryData } = useBigLibrariesQuery()
  const { search } = useSearch()

  return (
    <div className="pt-6 max-w-full md:max-w-6xl mx-auto">
      <title>Turbine | Libraries</title>
      <Search placeholder='Search npm packages' onChange={(res) => search(res)} />
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
              <div className="flex gap-1 items-center">
                <PackageIcon
                  className={cn(
                    'stroke-[1.5]',
                    lib.integrated
                      ? 'text-green-800 fill-green-500'
                      : 'fill-gray-200'
                  )}
                  width={24}
                  height={24}
                />
                <h3 className="text-xl">{lib.name}</h3>
              </div>
              <p className="text-md text-muted-foreground my-2">
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
