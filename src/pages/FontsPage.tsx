import FontDisplay from '@/components/Font/FontDisplay'
import React from 'react'
import { Link } from 'react-router-dom'
import { usePopularFontsQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FontsPageProps {}

const FontsPage: React.FC<FontsPageProps> = () => {
  const { data: popularFontsQueryData } = usePopularFontsQuery()
  return (
    <div className="max-w-6xl mx-auto">
      {popularFontsQueryData?.popularFonts &&
        popularFontsQueryData?.popularFonts?.map(
          (font) =>
            font && (
              <Link key={font.id} to={`/fonts/${font.name}`}>
                <div className="cursor-pointer p-4 border-b hover:bg-gray-200/20">
                  <FontDisplay font={font} />
                </div>
              </Link>
            )
        )}
    </div>
  )
}

export default FontsPage
