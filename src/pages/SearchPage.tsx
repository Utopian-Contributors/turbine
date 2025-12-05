import { abbreviateNumber } from 'js-abbreviation-number'
import { Globe, PackageIcon } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import Search from '@/components/blocks/search'
import FontDisplay from '@/components/Font/FontDisplay'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSearch } from '@/hooks/useSearch'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [showFonts, setShowFonts] = useState(true)
  const initialSearchTerm = new URLSearchParams(location.search).get('q') || ''
  const { librarySearchResults, fontSearchResults, search } =
    useSearch(initialSearchTerm)

  return (
    <div className="w-full">
      <title>Turbine | Search</title>
      <div className="w-fit mx-auto">
        <div className="sticky top-0 pt-4 pb-2 z-10">
          <Search
            onChange={(res) => search(res)}
            defaultValue={initialSearchTerm}
            autoFocus
          />
          <div className="w-fit flex mx-auto gap-4">
            <div className="cursor-pointer backdrop-blur-xs hover:bg-gray-300/10 rounded-lg p-2 mt-2 mb-2 flex items-center">
              <Checkbox
                id="showFonts"
                defaultChecked={showFonts}
                className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                onCheckedChange={() => setShowFonts(!showFonts)}
              />
              <Label
                htmlFor="showFonts"
                className="cursor-pointer ml-2 text-sm text-muted-foreground"
              >
                Show Fonts
              </Label>
            </div>
          </div>
        </div>
        {showFonts && (
          <div className="max-w-[60ch] flex flex-col gap-1">
            {fontSearchResults?.length !== 0 &&
              fontSearchResults?.map(
                (font, index) =>
                  font && [
                    <Link
                      key={font.id}
                      to={`/fonts/${font.name}`}
                      className={cn(
                        'cursor-pointer hover:shadow-md transition-shadow duration-300 flex-col my-1 p-4 bg-white border border-white hover:border-gray-300 rounded-xl',
                        font.integrated
                          ? 'hover:bg-green-200/10 hover:border-green-400 transition-all'
                          : 'hover:bg-gray-200/10 hover:border-gray-300 transition-all'
                      )}
                    >
                      <FontDisplay font={font} list />
                    </Link>,
                    <Separator
                      key={index + '-sep'}
                      className="bg-muted my-2"
                    />,
                  ]
              )}
          </div>
        )}
        <div className="max-w-[60ch] flex flex-col gap-1 mt-1">
          {librarySearchResults.length === 0 ? (
            <p className="text-gray-300 text-center">No results</p>
          ) : (
            librarySearchResults.map((result, index) => [
              <div
                key={index}
                className={cn(
                  'cursor-pointer hover:shadow-md transition-shadow duration-300 flex-col my-1 p-4 border border-white hover:border-gray-300 rounded-xl',
                  result.integrated
                    ? 'hover:bg-green-200/10 hover:border-green-400 transition-all'
                    : 'hover:bg-gray-200/10 hover:border-gray-300 transition-all'
                )}
                onClick={() =>
                  navigate('/l/' + encodeURIComponent(result.name))
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 items-end">
                    <PackageIcon
                      className={cn(
                        'stroke-[1.5]',
                        result.integrated
                          ? 'text-green-800 fill-green-500'
                          : 'fill-gray-200'
                      )}
                      width={24}
                      height={24}
                    />
                    <h3 className="text-xl">{result.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Globe
                      className={cn(
                        'h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer',
                        result.integrated && 'text-green-500'
                      )}
                      onClick={() => {
                        if (result.homepage) {
                          window.open(result.homepage, '_blank')
                        }
                      }}
                    />
                    <Icons.gitHub
                      className={cn(
                        'h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer',
                        result.integrated && 'text-green-500'
                      )}
                      onClick={() =>
                        window.open(
                          result.repository?.replace('git+', ''),
                          '_blank'
                        )
                      }
                    />
                    <Icons.npm
                      className={cn(
                        'h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer',
                        result.integrated && 'text-green-500'
                      )}
                      onClick={() =>
                        window.open(
                          `https://npmjs.com/${encodeURIComponent(
                            result.name
                          )}`,
                          '_blank'
                        )
                      }
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
              </div>,
              <Separator key={index + '-sep'} className="bg-muted my-2" />,
            ])
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
