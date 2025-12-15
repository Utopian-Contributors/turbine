import Search from '@/components/blocks/search'
import FontDisplay from '@/components/Font/FontDisplay'
import { Separator } from '@/components/ui/separator'
import { useSearch } from '@/hooks/useSearch'
import { cn } from '@/lib/utils'
import React from 'react'
import { Link } from 'react-router-dom'
import { usePopularFontsQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FontsPageProps {}

const FontsPage: React.FC<FontsPageProps> = () => {
  const { data: popularFontsQueryData } = usePopularFontsQuery()
  const { search } = useSearch()
  return (
    <div className='pt-6'>
      <title>Turbine | Fonts</title>
      <Search placeholder='Search fonts' onChange={(res) => search(res)} />
      <div className="pt-6 max-w-xl mx-auto flex flex-col gap-4 mt-6">
        {popularFontsQueryData?.popularFonts &&
          popularFontsQueryData?.popularFonts?.map(
            (font) =>
              font && [
                <Link key={font.id} to={`/fonts/${font.name}`}>
                  <div
                    className={cn(
                      'cursor-pointer border border-transparent rounded-lg p-4 hover:bg-gray-200/20',
                      font.integrated
                        ? 'hover:bg-green-200/10 hover:border-green-400 transition-all'
                        : 'hover:bg-gray-200/10 hover:border-gray-300 transition-all'
                    )}
                  >
                    <FontDisplay font={font} list />
                  </div>
                </Link>,
                <Separator key={`sep-${font.id}`} className="bg-muted" />,
              ]
          )}
      </div>
    </div>
  )
}

export default FontsPage
