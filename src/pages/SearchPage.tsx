import Search from '@/components/blocks/search'
import { Icons } from '@/components/ui/icons'
import { useSearch } from '@/hooks/useSearch'
import { abbreviateNumber } from 'js-abbreviation-number'
import { Globe } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { useLocation, useNavigate } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const initialSearchTerm = new URLSearchParams(location.search).get('q') || ''
  const { results, search } = useSearch(initialSearchTerm)

  return (
    <div>
      <title>Turbine | Search</title>
      <div className="w-[600px] mx-auto">
        <Search
          onChange={(res) => search(res)}
          defaultValue={initialSearchTerm}
          className="mx-auto"
        />
        <div className="max-w-[60ch] flex flex-col gap-1 mt-6">
          {results.length === 0 ? (
            <p className="text-gray-300 text-center">No results</p>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className="cursor-pointer flex-col my-1 p-4 border border-white hover:border-gray-300 rounded-xl"
                onClick={() =>
                  navigate('/l/' + encodeURIComponent(result.name))
                }
              >
                <div className="flex justify-between">
                  <div className="flex gap-2 items-end">
                    <h3 className="text-xl">{result.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Globe
                      className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer"
                      onClick={() =>
                        window.open(result.links.homepage, '_blank')
                      }
                    />
                    <Icons.gitHub
                      className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer"
                      onClick={() =>
                        window.open(
                          result.links.repository?.replace('git+', ''),
                          '_blank'
                        )
                      }
                    />
                    <Icons.npm
                      className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer"
                      onClick={() => window.open(result.links.npm, '_blank')}
                    />
                  </div>
                </div>
                <p className="text-md text-muted-foreground my-2">
                  {result.description}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <p className="text-sm text-gray-400 mb-1">
                      {abbreviateNumber(result.downloads)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">
                    {moment(result.updated).fromNow()}
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    {result.latestVersion}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
