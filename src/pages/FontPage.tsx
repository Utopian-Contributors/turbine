import FontDisplay from '@/components/Font/FontDisplay'
import FontEmbedConfig from '@/components/Font/FontEmbedConfig'
import React from 'react'
import { useParams } from 'react-router'
import {
    FontDocument,
    useFontQuery,
    useLoggedInQuery,
    useToggleFontIntegrationMutation,
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FontPageProps {}

const FontPage: React.FC<FontPageProps> = () => {
  const { font } = useParams<{ font: string }>()
  const { data: loggedInQueryData } = useLoggedInQuery()
  const [toggleFontIntegration] = useToggleFontIntegrationMutation({
    refetchQueries: [FontDocument],
  })
  const { data: fontQueryData } = useFontQuery({
    variables: { name: font || '' },
  })

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      <div className="p-4 border-b">
        {fontQueryData?.font && (
          <FontDisplay
            font={fontQueryData.font}
            isAdmin={!!loggedInQueryData?.loggedIn}
            onIntegrate={() =>
              fontQueryData.font?.id &&
              toggleFontIntegration({
                variables: { id: fontQueryData.font.id },
              })
            }
          />
        )}
      </div>
      <div className="p-4">
        {fontQueryData?.font?.name && fontQueryData?.font?.variants && (
          <FontEmbedConfig
            files={fontQueryData.font.files}
            fontName={fontQueryData.font.name}
            category={fontQueryData.font.category}
            variants={fontQueryData.font.variants}
          />
        )}
      </div>
    </div>
  )
}

export default FontPage
