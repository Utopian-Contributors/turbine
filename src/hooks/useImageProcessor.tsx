import { useCallback, useRef } from 'react'

export type ScaleOption = '1x' | '2x' | '4x'
export type QualityOption = 'high' | 'medium' | 'low' | 'tiny'

export interface ImageSettings {
  scale: ScaleOption
  quality: QualityOption
  convertToWebp: boolean
}

export interface LoadedImage {
  originalBlob: Blob
  originalBlobSize: number
  originalWidth: number
  originalHeight: number
  imageElement: HTMLImageElement
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
  const loadedImageRef = useRef<LoadedImage | null>(null)

  // Load an image from a Blob/File directly (for local files)
  const loadImageFromBlob = useCallback(
    async (blob: Blob): Promise<LoadedImage> => {
      const blobUrl = URL.createObjectURL(blob)

      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          URL.revokeObjectURL(blobUrl)

          const loadedImage: LoadedImage = {
            originalBlob: blob,
            originalBlobSize: blob.size,
            originalWidth: img.width,
            originalHeight: img.height,
            imageElement: img,
          }
          loadedImageRef.current = loadedImage
          resolve(loadedImage)
        }

        img.onerror = () => {
          URL.revokeObjectURL(blobUrl)
          reject(new Error('Failed to load image'))
        }

        img.src = blobUrl
      })
    },
    []
  )

  // Fetch and load an image from a remote URL
  const loadImageFromUrl = useCallback(
    async (imageUrl: string): Promise<LoadedImage> => {
      const originalResponse = await fetch(imageUrl, {
        mode: 'cors',
        credentials: 'omit',
      })
      if (!originalResponse.ok) {
        throw new Error('Failed to fetch original image')
      }
      const originalBlob = await originalResponse.blob()

      return loadImageFromBlob(originalBlob)
    },
    [loadImageFromBlob]
  )

  // Process an already-loaded image with given settings
  const processImage = useCallback(
    async (
      loadedImage: LoadedImage,
      settings: ImageSettings,
      originalFilename?: string
    ): Promise<ProcessedResult> => {
      return new Promise((resolve, reject) => {
        // Create a fresh canvas each time to avoid tainted canvas issues
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        const { imageElement, originalBlobSize, originalWidth, originalHeight } =
          loadedImage

        const scaleValue = getScaleValue(settings.scale)
        const newWidth = Math.floor(originalWidth * scaleValue)
        const newHeight = Math.floor(originalHeight * scaleValue)

        canvas.width = newWidth
        canvas.height = newHeight

        ctx.drawImage(imageElement, 0, 0, newWidth, newHeight)

        const mimeType = settings.convertToWebp ? 'image/webp' : 'image/png'
        const quality = settings.convertToWebp
          ? getQualityValue(settings.quality)
          : undefined

        canvas.toBlob(
          (blob: Blob | null) => {
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
              originalWidth,
              originalHeight,
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
      })
    },
    []
  )

  return { loadImageFromUrl, loadImageFromBlob, processImage, loadedImageRef }
}
