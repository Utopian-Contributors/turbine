import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { abbreviateFilename } from '@/helpers/strings'
import {
  DEFAULT_SETTINGS,
  type ImageSettings,
  type LoadedImage,
  type ProcessedResult,
  type QualityOption,
  type ScaleOption,
  useImageProcessor,
} from '@/hooks/useImageProcessor'
import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import { Download, Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface ImageConversionRowProps {
  id: string
  url: string
  originalSize: number
  width: number
  height: number
  clientWidth?: number
  clientHeight?: number
  filename?: string
  file?: File
  onProcessed: (id: string, result: ProcessedResult | null) => void
}

const ImageConversionRow: React.FC<ImageConversionRowProps> = ({
  id,
  url,
  width,
  height,
  clientWidth,
  clientHeight,
  filename,
  file,
  onProcessed,
}) => {
  // Detect optimal scale based on display size vs actual size
  const detectOptimalScale = useCallback((): ScaleOption => {
    // Need both actual dimensions and client dimensions to detect
    const actualW = width || 0
    const actualH = height || 0
    const displayW = clientWidth || 0
    const displayH = clientHeight || 0

    if (!displayW || !displayH || !actualW || !actualH) {
      return '1x' // Can't detect, use original
    }

    // Calculate the ratio of display size to actual size
    const widthRatio = displayW / actualW
    const heightRatio = displayH / actualH
    const ratio = Math.max(widthRatio, heightRatio) // Use the larger ratio to avoid upscaling

    // Map ratio to scale options
    if (ratio <= 0.3) {
      return '4x' // Display is 25% or less of actual -> scale to 25%
    } else if (ratio <= 0.6) {
      return '2x' // Display is 50% or less of actual -> scale to 50%
    }
    return '1x' // Display is close to actual size
  }, [width, height, clientWidth, clientHeight])

  const [settings, setSettings] = useState<ImageSettings>(() => ({
    ...DEFAULT_SETTINGS,
    scale: detectOptimalScale(),
  }))
  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null)
  const [processed, setProcessed] = useState<ProcessedResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)

  const { loadImageFromUrl, loadImageFromBlob, processImage } = useImageProcessor()
  const initialLoadDone = useRef(false)

  // Load the image once on mount
  useEffect(() => {
    if (initialLoadDone.current) return
    initialLoadDone.current = true

    const doLoad = async () => {
      setLoading(true)
      setError(null)
      try {
        // Use File directly if available (local files), otherwise fetch from URL
        const loaded = file
          ? await loadImageFromBlob(file)
          : await loadImageFromUrl(url)
        setLoadedImage(loaded)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load image')
        setHidden(true)
      } finally {
        setLoading(false)
      }
    }

    doLoad()
  }, [url, file, loadImageFromUrl, loadImageFromBlob])

  // Process when settings change (and image is loaded)
  useEffect(() => {
    if (!loadedImage) return

    const doProcess = async () => {
      setProcessing(true)
      setError(null)

      try {
        // Revoke old URL to prevent memory leak
        if (processed?.processedUrl) {
          URL.revokeObjectURL(processed.processedUrl)
        }

        const originalFilename = filename || url.split('/').pop() || 'image'
        const result = await processImage(loadedImage, settings, originalFilename)
        setProcessed(result)
        onProcessed(id, result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Processing failed')
        setProcessed(null)
        onProcessed(id, null)
      } finally {
        setProcessing(false)
      }
    }

    doProcess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedImage, settings])

  const handleDownload = useCallback(() => {
    if (!processed?.processedUrl) return

    const link = document.createElement('a')
    link.href = processed.processedUrl
    const originalName = filename || url.split('/').pop() || 'image'
    const extension = settings.convertToWebp ? '.webp' : '.png'
    link.download = originalName.replace(/\.[^.]+$/, '') + extension
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [processed?.processedUrl, url, filename, settings.convertToWebp])

  // Use actual values from the fetched/processed image
  const originalBlobSize = processed?.originalBlobSize ?? 0
  const actualWidth = processed?.originalWidth ?? width
  const actualHeight = processed?.originalHeight ?? height
  const savings = processed ? originalBlobSize - processed.processedSize : 0
  const savingsPercent =
    processed && originalBlobSize > 0
      ? Math.round((1 - processed.processedSize / originalBlobSize) * 100)
      : 0

  // Don't render if hidden due to error
  if (hidden) {
    return (
      <div>
        <p className="text-red-500">Error displaying: </p>
        <a href={url} target="_blank" className="underline">
          {url}
        </a>
      </div>
    )
  }

  const isWorking = loading || processing

  return (
    <Card className="overflow-hidden py-0 mx-2">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Original Preview */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-muted-foreground uppercase">
                Original
              </div>
            </div>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
              <img
                src={url}
                alt=""
                className="max-w-full max-h-full object-contain"
                crossOrigin={url.startsWith('blob:') ? undefined : 'anonymous'}
              />
            </div>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div
                    className="truncate text-muted-foreground"
                    title={filename || url}
                  >
                    {abbreviateFilename(filename || url.split('/').pop()!, 30)}
                  </div>
                  <span className="text-xs">
                    {actualWidth} × {actualHeight}
                  </span>
                </div>
                <span className="h-fit">
                  {processed ? filesize(originalBlobSize) : '...'}
                </span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="flex flex-col justify-center gap-3 lg:w-48">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">Scale</label>
              <Select
                value={settings.scale}
                onValueChange={(v) =>
                  setSettings((s) => ({ ...s, scale: v as ScaleOption }))
                }
              >
                <SelectTrigger className="w-full">
                  {settings.scale}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1x">1x (Original)</SelectItem>
                  <SelectItem value="2x">2x (50%)</SelectItem>
                  <SelectItem value="4x">4x (25%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">Quality</label>
              <Select
                value={settings.quality}
                disabled={!settings.convertToWebp}
                onValueChange={(v) =>
                  setSettings((s) => ({ ...s, quality: v as QualityOption }))
                }
              >
                <SelectTrigger className="w-full">
                  {settings.quality === 'high'
                    ? 'High'
                    : settings.quality === 'medium'
                    ? 'Medium'
                    : settings.quality === 'low'
                    ? 'Low'
                    : 'Tiny'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (85%)</SelectItem>
                  <SelectItem value="medium">Medium (65%)</SelectItem>
                  <SelectItem value="low">Low (45%)</SelectItem>
                  <SelectItem value="tiny">Tiny (25%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`webp-${id}`}
                checked={settings.convertToWebp}
                onCheckedChange={(checked) =>
                  setSettings((s) => ({
                    ...s,
                    convertToWebp: checked === true,
                  }))
                }
              />
              <label htmlFor={`webp-${id}`} className="text-sm cursor-pointer">
                Convert to WebP
              </label>
            </div>
          </div>

          {/* Converted Preview */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground uppercase mb-2">
              Converted
            </div>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden relative">
              {isWorking ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : error ? (
                <div className="text-red-500 text-sm p-4 text-center">
                  {error}
                </div>
              ) : processed ? (
                <>
                  <img
                    src={processed.processedUrl}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                  {savingsPercent > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      -{savingsPercent}%
                    </div>
                  )}
                </>
              ) : null}
            </div>
            <div className="mt-2 text-sm">
              {processed && !isWorking ? (
                <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-2">
                  <div className="w-full flex justify-between">
                    <div className="flex flex-col">
                      <div
                        className="truncate text-muted-foreground"
                        title={processed.processedFilename}
                      >
                        {abbreviateFilename(processed.processedFilename, 24)}
                      </div>
                      <span className="text-xs h-[16px]">
                        {processed.processedWidth} × {processed.processedHeight}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={cn(
                          'font-medium',
                          savings > 0 ? 'text-green-500' : 'text-orange-500'
                        )}
                      >
                        {filesize(processed.processedSize)}
                      </span>
                      <span
                        className={cn(
                          'text-xs',
                          savings > 0 ? 'text-green-500' : 'text-orange-500'
                        )}
                      >
                        {savings > 0
                          ? `${filesize(savings)} saved`
                          : `${filesize(-savings)} larger`}
                      </span>
                    </div>
                  </div>
                  {savings > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full lg:w-fit flex gap-2 items-center"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                      <span className="lg:hidden">Download</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">...</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ImageConversionRow
