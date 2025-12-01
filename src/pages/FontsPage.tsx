import Search from '@/components/blocks/search'
import FontDisplay from '@/components/Font/FontDisplay'
import { useSearch } from '@/hooks/useSearch'
import React from 'react'
import { Link } from 'react-router-dom'
import {
  usePopularFontsQuery
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FontsPageProps {}

const FontsPage: React.FC<FontsPageProps> = () => {
  const { data: popularFontsQueryData } = usePopularFontsQuery()
  const { search } = useSearch()
  return (
    <div>
      <title>Turbine | Fonts</title>
      <Search onChange={(res) => search(res)} />
      <div className="max-w-xl mx-auto flex flex-col gap-4 mt-6">
        {popularFontsQueryData?.popularFonts &&
          popularFontsQueryData?.popularFonts?.map(
            (font) =>
              font && (
                <Link key={font.id} to={`/fonts/${font.name}`}>
                  <div className="cursor-pointer border rounded-lg p-4 hover:bg-gray-200/20">
                    <FontDisplay font={font} />
                  </div>
                </Link>
              )
          )}
      </div>
    </div>
  )
}

export default FontsPage
