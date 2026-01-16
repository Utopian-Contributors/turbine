import { useCallback, useRef } from 'react'

export type ScaleOption = '1x' | '2x' | '4x'
export type QualityOption = 'high' | 'medium' | 'low' | 'tiny'

export interface ImageSettings {
  scale: ScaleOption
  quality: QualityOption
  convertToWebp: boolean
}

export interface ProcessedResult {
  originalBlobSize: number
  originalWidth: number
  originalHeight: number
  processedSize: number
  processedWidth: number
  processedHeight: number
  processedFilename: string
  processedUrl: string
}

export const DEFAULT_SETTINGS: ImageSettings = {
  scale: '1x',
  quality: 'high',
  convertToWebp: true,
}

const getScaleValue = (scale: ScaleOption): number => {
  switch (scale) {
    case '4x':
      return 0.25
    case '2x':
      return 0.5
    default:
      return 1
  }
}

const getQualityValue = (quality: QualityOption): number => {
  switch (quality) {
    case 'high':
      return 0.85
    case 'medium':
      return 0.65
    case 'low':
      return 0.45
    case 'tiny':
      return 0.25
    default:
      return 0.85
  }
}

export const useImageProcessor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const getCanvas = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }
    return canvasRef.current
  }, [])

  const processImage = useCallback(
    async (
      imageUrl: string,
      settings: ImageSettings,
      originalFilename?: string
    ): Promise<ProcessedResult> => {
      // First, fetch the original image to get its actual blob size
      const originalResponse = await fetch(imageUrl)
      if (!originalResponse.ok) {
        throw new Error('Failed to fetch original image')
      }
      const originalBlob = await originalResponse.blob()
      const originalBlobSize = originalBlob.size

      return new Promise((resolve, reject) => {
        const img = new Image()
        // Only set crossOrigin for remote URLs, not for blob URLs
        if (!imageUrl.startsWith('blob:')) {
          img.crossOrigin = 'anonymous'
        }

        img.onload = () => {
          const canvas = getCanvas()
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          const scaleValue = getScaleValue(settings.scale)
          const newWidth = Math.floor(img.width * scaleValue)
          const newHeight = Math.floor(img.height * scaleValue)

          canvas.width = newWidth
          canvas.height = newHeight

          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          const mimeType = settings.convertToWebp ? 'image/webp' : 'image/png'
          const quality = settings.convertToWebp
            ? getQualityValue(settings.quality)
            : undefined

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'))
                return
              }

              // Generate processed filename
              const baseName = originalFilename
                ? originalFilename.replace(/\.[^.]+$/, '')
                : 'image'
              const extension = settings.convertToWebp ? '.webp' : '.png'
              const processedFilename = `${baseName}${extension}`

              const processedUrl = URL.createObjectURL(blob)
              resolve({
                originalBlobSize,
                originalWidth: img.width,
                originalHeight: img.height,
                processedSize: blob.size,
                processedWidth: newWidth,
                processedHeight: newHeight,
                processedFilename,
                processedUrl,
              })
            },
            mimeType,
            quality
          )
        }

        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = imageUrl
      })
    },
    [getCanvas]
  )

  return { processImage }
}
