import { abbreviateFilename } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import { Globe, Info } from 'lucide-react'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import type { BundledFileProps } from './Bundle'

const getFilename = (url: string, baseUrl: string) => {
  try {
    const absolutePath = new URL(url).pathname
    const relativePath = absolutePath
      .slice(new URL(baseUrl).pathname.length)
      .startsWith('/')
      ? absolutePath.replace(new URL(baseUrl).pathname, '')
      : absolutePath
    const segments = relativePath.split('/').filter(Boolean)
    return segments[segments.length - 1] || relativePath.slice(1)
  } catch {
    // Fallback if URL parsing fails
    return url.replace(baseUrl, '').split('?')[0].split('/').pop() || url
  }
}

const FileTooltip: React.FC<
  { url: string; contentType: string } & React.HTMLAttributes<HTMLDivElement>
> = ({ url, contentType }) => {
  if (contentType.includes('png') || url.split("?")[0].endsWith('.png')) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Info className="text-gray-400" size={16} />
        </TooltipTrigger>
        <TooltipContent className="max-w-48 text-center">
          <p>
            Images should use{' '}
            <span className="bg-gray-600 px-1 rounded">.webp</span> format for
            better performance.
          </p>
        </TooltipContent>
      </Tooltip>
    )
  }
  return null
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
          <div className="flex items-center gap-1">
            <a
              className={cn(
                'max-w-[60ch] text-md truncate',
                contentType.includes('png') || url.split("?")[0].endsWith('.png')
                  ? 'text-red-500'
                  : 'text-primary'
              )}
              href={url}
              target="_blank"
            >
              {new URL(url).pathname !== '/'
                ? abbreviateFilename(getFilename(url, baseUrl), 26)
                : new URL(url).hostname}
            </a>
            <FileTooltip url={url} contentType={contentType} />
          </div>
          <div className="flex items-center gap-1">
            {new URL(url).hostname !== new URL(baseUrl).hostname ? (
              <Globe className="h-3 w-3 text-muted-foreground" />
            ) : null}{' '}
            <span className="max-w-48 truncate text-xs text-muted-foreground leading-[14px]">
              {abbreviateFilename(new URL(url).hostname, 40)}
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
            ? 'w-xs grid-cols-1 md:grid-cols-4'
            : 'w-[10rem] grid-cols-1 md:grid-cols-2'
        )}
      >
        {clientWidth && clientHeight && width && height
          ? [
              <div
                key="natural"
                className={cn(
                  'hidden col-span-1 md:flex flex-col items-end',
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
                className={'hidden col-span-1 md:flex flex-col items-end'}
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
        <div className="hidden col-span-1 md:flex flex-col items-end">
          <span>{elapsed}ms</span>
          <span className="text-xs text-muted-foreground">Load time</span>
        </div>
      </div>
    </div>
  )
}

export default BundledFile
