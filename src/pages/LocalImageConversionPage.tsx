import { ImageConversionRow } from '@/components/ImageConversion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type ProcessedResult } from '@/hooks/useImageProcessor'
import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import JSZip from 'jszip'
import { Download, Loader2, Upload } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface LocalImage {
  id: string
  file: File
  url: string
  width: number
  height: number
}

interface ProcessedState {
  originalBlobSize: number
  processedSize: number
  processedUrl: string
  processedFilename: string
}

const LocalImageConversionPage: React.FC = () => {
  const [images, setImages] = useState<LocalImage[]>([])
  const [processedStates, setProcessedStates] = useState<
    Map<string, ProcessedState>
  >(new Map())
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    document.title = 'Image Tool | Turbine'
  }, [])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
    }
  }, [images])

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const imageFiles = fileArray
        .filter((file) => file.type.startsWith('image/png'))

      imageFiles.forEach((file) => {
        // Check for duplicates by name and size
        const isDuplicate = images.some(
          (existing) =>
            existing.file.name === file.name &&
            existing.file.size === file.size,
        )
        if (isDuplicate) {
          return
        }

        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
          const newImage: LocalImage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            url,
            width: img.width,
            height: img.height,
          }
          setImages((prev) => {
            // Double-check for duplicates in case of race conditions
            const alreadyExists = prev.some(
              (existing) =>
                existing.file.name === file.name &&
                existing.file.size === file.size,
            )
            if (alreadyExists) {
              URL.revokeObjectURL(url)
              return prev
            }
            return [...prev, newImage]
          })
        }
        img.src = url
      })
    },
    [images],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const handleProcessed = useCallback(
    (id: string, result: ProcessedResult | null) => {
      setProcessedStates((prev) => {
        const next = new Map(prev)
        if (result) {
          next.set(id, {
            originalBlobSize: result.originalBlobSize,
            processedSize: result.processedSize,
            processedUrl: result.processedUrl,
            processedFilename: result.processedFilename,
          })
        } else {
          next.delete(id)
        }
        return next
      })
    },
    [],
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

  const [downloading, setDownloading] = useState(false)
  const zipDownloadRef = useRef<HTMLAnchorElement>(null)
  const [zipUrl, setZipUrl] = useState<string | null>(null)

  const handleDownloadAll = useCallback(async () => {
    setDownloading(true)
    try {
      const zip = new JSZip()

      // Fetch each processed image and add to zip
      for (const [, state] of processedStates) {
        const response = await fetch(state.processedUrl)
        const blob = await response.blob()
        zip.file(state.processedFilename, blob)
      }

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)

      // Revoke old URL if exists
      if (zipUrl) {
        URL.revokeObjectURL(zipUrl)
      }
      setZipUrl(url)

      // Trigger download after state update
      setTimeout(() => {
        zipDownloadRef.current?.click()
      }, 0)
    } finally {
      setDownloading(false)
    }
  }, [processedStates, zipUrl])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Tool</h1>
        <p className="text-muted-foreground">
          Convert and optimize your images locally. Nothing is uploaded or
          stored.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors cursor-pointer',
          dragOver
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/png"
          className="hidden"
          onChange={handleFileInput}
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-200" />
        <p className="text-lg font-medium mb-1">
          Drop images here or click to select
        </p>
        <p className="text-sm text-gray-400">Supports PNG images</p>
      </div>

      {/* Hidden download link for zip */}
      {zipUrl && (
        <a
          ref={zipDownloadRef}
          href={zipUrl}
          download="converted-images.zip"
          className="hidden"
        >
          Download Zip
        </a>
      )}

      {/* Sticky Savings Summary */}
      {processedStates.size > 0 && totalSavings.saved > 0 && (
        <div className="sticky top-4 z-10 mb-6">
          <Card className="border-green-500/30 bg-background/80 backdrop-blur py-0">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-green-500">
                    {Math.round(
                      (1 -
                        totalSavings.processedTotal /
                          totalSavings.originalTotal) *
                        100,
                    )}
                    % reduction ({filesize(totalSavings.saved)})
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {filesize(totalSavings.originalTotal)} →{' '}
                    {filesize(totalSavings.processedTotal)}
                  </span>
                </div>
                <Button
                  onClick={handleDownloadAll}
                  disabled={downloading}
                  className="gap-2"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {downloading ? 'Creating Zip...' : 'Download All'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Image List */}
      <div className="flex flex-col gap-4">
        {images.map((image) => (
          <ImageConversionRow
            key={image.id}
            id={image.id}
            url={image.url}
            originalSize={image.file.size}
            width={image.width}
            height={image.height}
            filename={image.file.name}
            file={image.file}
            onProcessed={handleProcessed}
          />
        ))}
      </div>
    </div>
  )
}

export default LocalImageConversionPage
