import { abbreviateNumber } from 'js-abbreviation-number'
import { Globe, PackageIcon, Type } from 'lucide-react'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import Search from '@/components/blocks/search'
import FontDisplay from '@/components/Font/FontDisplay'
import { Checkbox } from '@/components/ui/checkbox'
import CurvedLoop from '@/components/ui/CurvedLoop'
import { Icons } from '@/components/ui/icons'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSearch } from '@/hooks/useSearch'
import { cn } from '@/lib/utils'
import { useSearchPageEmptyStateQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const initialSearchTerm = new URLSearchParams(location.search).get('q') || ''
  const isLibrarySearch =
    new URLSearchParams(location.search).get('s') === 'lib'
  const isFontSearch = new URLSearchParams(location.search).get('s') === 'font'

  const [showFonts, setShowFonts] = useState(isLibrarySearch ? false : true)

  const { librarySearchResults, fontSearchResults, search } =
    useSearch(initialSearchTerm)

  const { data: emptyStateData } = useSearchPageEmptyStateQuery({
    skip: !!initialSearchTerm,
  })

  const showEmptyState =
    !initialSearchTerm &&
    librarySearchResults.length === 0 &&
    fontSearchResults?.length === 0

  // Combine libraries and fonts for the word cloud
  const marqueeWords = useMemo(() => {
    if (!emptyStateData) return []
    const libraries =
      emptyStateData.bigLibraries?.slice(0, 24).map((lib) => ({
        text: lib.name,
        integrated: lib.integrated ?? false,
        type: 'library' as const,
      })) ?? []
    const fonts =
      emptyStateData.popularFonts?.slice(0, 12).map((font) => ({
        text: font.name,
        integrated: font.integrated ?? false,
        type: 'font' as const,
      })) ?? []
    return [libraries, fonts]
  }, [emptyStateData])

  return (
    <div className="pt-6 w-full h-screen">
      <title>Turbine | Search</title>
      <div className="w-full lg:w-2xl mx-auto">
        {!showEmptyState && (
          <div className="sticky top-8 pb-2 z-10">
            <Search
              placeholder="Search npm packages and fonts"
              onChange={(res) => search(res)}
              defaultValue={initialSearchTerm}
              autoFocus
            />
            <div className="w-fit flex mx-auto gap-4">
              <div className="cursor-pointer backdrop-blur-xs hover:bg-gray-300/10 rounded-lg p-2 mt-2 mb-2 flex items-center">
                <Checkbox
                  id="showFonts"
                  defaultChecked={showFonts}
                  className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-500"
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
        )}
        {showFonts && (
          <div className="w-full flex flex-col gap-1">
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
        {showEmptyState && emptyStateData && (
          <div className="overflow-hidden">
            <div className="absolute inset-0 -z-1 opacity-10">
              <div className="relative">
                <CurvedLoop
                  svgClassname="mt-80"
                  className="grayscale font-thin fill-primary"
                  speed={0.5}
                  interactive={false}
                  marqueeText={marqueeWords[0]
                    .map((word) => word.text)
                    .join(' 📦 ')}
                />
              </div>
            </div>
            <div className="absolute inset-0 -z-1 opacity-10">
              <div className="relative h-fit">
                <CurvedLoop
                  svgClassname="mb-32"
                  className="grayscale font-thin fill-primary"
                  direction="right"
                  curveAmount={-400}
                  speed={0.5}
                  interactive={false}
                  marqueeText={marqueeWords[1]
                    .map((word) => word.text)
                    .join(' 🖋️ ')}
                />
              </div>
            </div>
          </div>
        )}
        {showEmptyState && emptyStateData && (
          <div className="absolute top-1/2 transform -translate-y-1/2 max-w-[50vw] flex flex-col rounded-xl border border-gray-300 bg-white/80 backdrop-blur-xs shadow-sm gap-2 px-4 py-8">
            {/* Floating word cloud background */}

            {/* Guidance text */}
            <div className="text-center">
              <Search
                className="bg-white"
                placeholder="Search npm packages and fonts"
                onChange={(res) => search(res)}
                defaultValue={initialSearchTerm}
                autoFocus
              />
              <p className="text-sm text-gray-300 font-light mt-1">
                Try: react, lodash, Roboto, Open Sans
              </p>
              <div className="w-fit text-xs rounded-full border border-green-200 bg-green-50 text-green-500 px-2 py-1 mx-auto mt-4">
                Native to the Utopia Browser
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="bg-white flex flex-col gap-2 border rounded-lg p-4 text-center">
                <p className="text-3xl font-thin">
                  {abbreviateNumber(
                    emptyStateData.searchStats?.totalLibraries ?? 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Libraries tracked
                </p>
              </div>
              <div className="bg-white flex flex-col gap-2 border rounded-lg p-4 text-center">
                <p className="text-3xl font-thin">
                  {abbreviateNumber(
                    emptyStateData.searchStats?.totalFonts ?? 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Fonts available</p>
              </div>
              <div className="bg-white flex flex-col gap-2 border rounded-lg p-4 text-center">
                <p className="text-3xl font-thin">
                  {abbreviateNumber(
                    emptyStateData.searchStats?.totalIntegratedLibraries ?? 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Versions integrated
                </p>
              </div>
            </div>

            {/* Popular Libraries */}
            <div className="mb-4">
              <h3 className="text-sm text-gray-300 uppercase mb-2">
                Popular Libraries
              </h3>
              <div className="flex flex-wrap gap-2">
                {emptyStateData.bigLibraries?.map((lib) => (
                  <button
                    key={lib.id}
                    onClick={() =>
                      navigate('/l/' + encodeURIComponent(lib.name))
                    }
                    className={cn(
                      'cursor-pointer bg-white px-3 py-1 rounded-full border text-sm hover:shadow-sm transition-all',
                      lib.integrated
                        ? 'border-green-400 bg-green-50 hover:bg-green-100'
                        : 'border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <PackageIcon
                        className={cn(
                          'stroke-[1.5]',
                          lib.integrated
                            ? 'text-green-800 fill-green-500'
                            : 'fill-gray-200'
                        )}
                        width={14}
                        height={14}
                      />
                      {lib.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Fonts */}
            <div>
              <h3 className="text-sm text-gray-300 uppercase mb-2">
                Popular Fonts
              </h3>
              <div className="flex flex-wrap gap-2">
                {emptyStateData.popularFonts?.map((font) => (
                  <button
                    key={font.id}
                    onClick={() =>
                      navigate('/fonts/' + encodeURIComponent(font.name))
                    }
                    className={cn(
                      'cursor-pointer bg-white px-3 py-1 rounded-full border text-sm hover:shadow-sm transition-all',
                      font.integrated
                        ? 'border-green-400 bg-green-50 hover:bg-green-100'
                        : 'border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <style>
                      {`@font-face {
                        font-family: "${font.name}-menu";
                        src: url("${font.menu}");
                        font-display: swap;
                      }`}
                    </style>
                    <div
                      className="flex items-center gap-1"
                      style={{ fontFamily: `${font.name}-menu` }}
                    >
                      <Type
                        className={cn(
                          'stroke-[1.5]',
                          font.integrated ? 'text-green-600' : 'text-gray-400'
                        )}
                        width={14}
                        height={14}
                      />
                      {font.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {!isFontSearch && !showEmptyState && (
          <div className="w-full flex flex-col gap-1 mt-1">
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
        )}
      </div>
    </div>
  )
}

export default SearchPage
