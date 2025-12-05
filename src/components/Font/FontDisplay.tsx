import { cn } from '@/lib/utils'
import type { Font } from 'generated/graphql'
import { toHeaderCase } from 'js-convert-case'
import { CheckIcon, FileTypeIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Icons } from '../ui/icons'

interface FontDisplayProps {
  font: Pick<Font, 'name' | 'menu' | 'category' | 'tags' | 'integrated'>
  isAdmin?: boolean
  list?: boolean
  onIntegrate?: () => void
}

const FontDisplay: React.FC<FontDisplayProps> = ({
  font,
  isAdmin,
  list,
  onIntegrate,
}) => {
  const fontFace = `
    @font-face {
      font-family: "${font.name}-menu";
      src: url("${font.menu}");
      font-display: block;
    }
  `

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2">
        <style>{fontFace}</style>
        <div className="flex items-center gap-2">
          <FileTypeIcon
            className={cn(
              'stroke-2',
              font.integrated
                ? 'text-green-800 fill-green-500'
                : 'fill-gray-200'
            )}
            width={20}
            height={20}
          />
          <h1 className="text-xl" style={{ fontFamily: `${font.name}-menu` }}>
            {font.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-1">
          <span
            key="category"
            className="h-[fit-content] bg-white border border-gray-200 px-2 py-1 rounded-sm text-xs text-muted-foreground"
          >
            {toHeaderCase(font.category)}
          </span>
          {font.tags?.length > 4
            ? font.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="h-[fit-content] bg-white border border-gray-200 px-2 py-1 rounded-sm text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))
            : font.tags.length
            ? font.tags?.map((tag) => (
                <span
                  key={tag}
                  className="h-[fit-content] border border-gray-200 px-2 py-1 rounded-sm text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))
            : null}
        </div>
      </div>
      <div className={cn('flex gap-4', list ? 'items-start' : 'items-center')}>
        <Link
          to={`https://fonts.google.com/specimen/${encodeURIComponent(
            font.name
          )}`}
          target="_blank"
        >
          <Icons.google className="h-5 w-5 text-gray-200 hover:text-gray-500 cursor-pointer" />
        </Link>
        {isAdmin && onIntegrate ? (
          <Button
            variant={font.integrated ? 'default' : 'outline'}
            onClick={() => onIntegrate()}
          >
            {font.integrated ? (
              <CheckIcon className="mr-2 h-4 w-4" />
            ) : (
              <PlusIcon className="mr-2 h-4 w-4" />
            )}
            {font.integrated ? 'Integrated' : 'Integrate'}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default FontDisplay
