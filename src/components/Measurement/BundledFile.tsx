import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import { Globe } from 'lucide-react'
import React from 'react'
import type { BundledFileProps } from './Bundle'

const getFilename = (url: string, baseUrl: string) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    // Remove baseUrl pathname from the full pathname
    const basePathname = new URL(baseUrl).pathname
    const relativePath = pathname.replace(basePathname, '')
    // Get the last segment (filename)
    const segments = relativePath.split('/').filter(Boolean)
    return segments[segments.length - 1] || relativePath
  } catch {
    // Fallback if URL parsing fails
    return url.replace(baseUrl, '').split('?')[0].split('/').pop() || url
  }
}

const abbreviateFilename = (filename: string, maxLength = 40) => {
  if (filename.length <= maxLength) return filename

  const lastDotIndex = filename.lastIndexOf('.')
  const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : ''
  const nameWithoutExt =
    lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename

  // Calculate how many characters to show on each side
  const availableLength = maxLength - extension.length - 3 // 3 for "..."
  const startLength = Math.ceil(availableLength / 2)
  const endLength = Math.floor(availableLength / 8)

  const start = nameWithoutExt.slice(0, startLength)
  const end = nameWithoutExt.slice(-endLength)

  return `${start}...${end}${extension}`
}

const BundledFile: React.FC<BundledFileProps> = ({
  baseUrl,
  url,
  contentType,
  size,
  elapsed,
  width,
  height,
  clientWidth,
  clientHeight,
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-1">
          <div>
            <a
              className="max-w-[60ch] text-md truncate"
              href={url}
              target="_blank"
            >
              {new URL(url).pathname !== '/'
                ? abbreviateFilename(getFilename(url, baseUrl))
                : new URL(url).hostname}
            </a>
          </div>
          <div className="flex items-center gap-1">
            {new URL(url).hostname !== new URL(baseUrl).hostname ? (
              <Globe className="h-3 w-3 text-muted-foreground" />
            ) : null}{' '}
            <span className="text-xs text-muted-foreground leading-[10px]">
              {new URL(url).hostname}
            </span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          'grid gap-2',
          contentType.includes('image') &&
            width &&
            height &&
            clientWidth &&
            clientHeight
            ? 'w-xs grid-cols-4'
            : 'w-[10rem] grid-cols-2'
        )}
      >
        {clientWidth && clientHeight && width && height
          ? [
              <div
                key="natural"
                className={cn(
                  'col-span-1 flex flex-col items-end',
                  width > clientWidth && height > clientHeight
                    ? 'text-red-500'
                    : ''
                )}
              >
                <span>
                  {width}x{height}
                </span>
                <span className="text-xs text-muted-foreground">
                  Dimensions
                </span>
              </div>,
              <div
                key="rendered"
                className={'col-span-1 flex flex-col items-end'}
              >
                <span>
                  {clientWidth}x{clientHeight}
                </span>
                <span className="text-xs text-muted-foreground">Rendered</span>
              </div>,
            ]
          : null}
        <div className="col-span-1 flex flex-col items-end">
          <span>{filesize(size)}</span>
          <span className="text-xs text-muted-foreground">File size</span>
        </div>
        <div className="col-span-1 flex flex-col items-end">
          <span>{elapsed}ms</span>
          <span className="text-xs text-muted-foreground">Load time</span>
        </div>
      </div>
    </div>
  )
}

export default BundledFile
