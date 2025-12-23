import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useImagesToConvertQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImageConversionPageProps {}

const ImageConversionPage: React.FC<ImageConversionPageProps> = () => {
  const params = useParams()
  const location = useLocation()
  const search = new URLSearchParams(location.search)

  const { data: imagesData, loading, error } = useImagesToConvertQuery({
    variables: {
      url: new URL(search.get('path') ?? '/', `https://${params.host}`).href,
    },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const images = imagesData?.imagesToConvert

  return <div className='p-6'>{JSON.stringify(images, null, 2)}</div>
}

export default ImageConversionPage
