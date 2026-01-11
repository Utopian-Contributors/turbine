import { ImageConversionRow } from '@/components/ImageConversion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type ProcessedResult } from '@/hooks/useImageProcessor'
import { filesize } from 'filesize'
import { ImageIcon, Monitor, Smartphone, Tablet } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useImagesToConvertQuery } from '../../generated/graphql'

type Environment = 'desktop' | 'tablet' | 'mobile'

interface ProcessedState {
  originalBlobSize: number
  processedSize: number
}

const ImageConversionPage: React.FC = () => {
  const params = useParams()
  const location = useLocation()
  const search = new URLSearchParams(location.search)

  const [environment, setEnvironment] = useState<Environment>('desktop')

  const {
    data: imagesData,
    loading,
    error,
  } = useImagesToConvertQuery({
    variables: {
      host: params.host!,
      path: search.get('path')!,
    },
  })

  const [processedStates, setProcessedStates] = useState<
    Map<string, ProcessedState>
  >(new Map())

  // Get PNG images for the selected environment
  const pngImages = useMemo(() => {
    if (!imagesData?.imagesToConvert) return []
    
    // Select images based on environment
    const environmentImages = imagesData.imagesToConvert[environment] || []
    
    // Filter for PNG images and deduplicate by URL
    const seen = new Set<string>()
    return environmentImages.filter((img) => {
      if (seen.has(img.url)) return false
      seen.add(img.url)
      return (
        img.type === 'image/png' ||
        img.url.toLowerCase().split('?')[0].endsWith('.png')
      )
    })
  }, [imagesData, environment])

  // Reset processed states when environment changes
  useEffect(() => {
    setProcessedStates(new Map())
  }, [environment])

  const handleProcessed = useCallback(
    (id: string, result: ProcessedResult | null) => {
      setProcessedStates((prev) => {
        const next = new Map(prev)
        if (result) {
          next.set(id, {
            originalBlobSize: result.originalBlobSize,
            processedSize: result.processedSize,
          })
        } else {
          next.delete(id)
        }
        return next
      })
    },
    []
  )

  const totalSavings = useMemo(() => {
    let originalTotal = 0
    let processedTotal = 0
    processedStates.forEach((state) => {
      originalTotal += state.originalBlobSize
      processedTotal += state.processedSize
    })
    return {
      originalTotal,
      processedTotal,
      saved: originalTotal - processedTotal,
    }
  }, [processedStates])

  useEffect(() => {
    document.title = 'Image Conversion'
  }, [])

  if (loading) return <div className="p-6">Loading...</div>
  if (error)
    return <div className="p-6 text-red-500">Error: {error.message}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold">Image Conversion</h1>
          <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Desktop
                </div>
              </SelectItem>
              <SelectItem value="tablet">
                <div className="flex items-center gap-2">
                  <Tablet className="w-4 h-4" />
                  Tablet
                </div>
              </SelectItem>
              <SelectItem value="mobile">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground">
          Found {pngImages.length} PNG images for {environment}. Convert them to WebP and optimize
          for better performance.
        </p>
      </div>

      {/* Sticky Savings Summary */}
      {processedStates.size > 0 && totalSavings.originalTotal > 0 && (
        <div className="sticky top-4 z-10 mb-6">
          <Card className="border-green-500/30 bg-background/80 backdrop-blur py-0">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-green-500">
                    {filesize(totalSavings.saved)} saved
                  </span>
                  <span className="text-sm text-muted-foreground uppercase">
                    Total Savings
                  </span>
                </div>
                <div className="flex flex-col items-end text-sm text-muted-foreground">
                  <span className="text-2xl font-bold ml-2 text-green-500">
                    {Math.round(
                      (1 -
                        totalSavings.processedTotal /
                          totalSavings.originalTotal) *
                        100
                    )}
                    % reduction
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {filesize(totalSavings.originalTotal)} →{' '}
                    {filesize(totalSavings.processedTotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Image List */}
      <div className="flex flex-col gap-4">
        {pngImages.map((image) => (
          <ImageConversionRow
            key={image.id}
            id={image.id}
            url={image.url}
            originalSize={Number(image.size)}
            width={image.width || 0}
            height={image.height || 0}
            clientWidth={image.clientWidth || undefined}
            clientHeight={image.clientHeight || undefined}
            onProcessed={handleProcessed}
          />
        ))}
      </div>

      {pngImages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No PNG images found for this page.</p>
        </div>
      )}
    </div>
  )
}

export default ImageConversionPage
