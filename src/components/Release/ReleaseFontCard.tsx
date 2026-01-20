import { cn } from '@/lib/utils'
import { toHeaderCase } from 'js-convert-case'
import { useNavigate } from 'react-router'

import { type FontItem } from './types'

interface ReleaseFontCardProps {
  font: FontItem
}

export function ReleaseFontCard({ font }: ReleaseFontCardProps) {
  const navigate = useNavigate()

  const fontFace = font.menu
    ? `
    @font-face {
      font-family: "${font.name}-menu";
      src: url("${font.menu}");
      font-display: block;
    }
  `
    : null

  return (
    <div
      onClick={() => navigate('/fonts/' + font.name)}
      className={cn(
        'cursor-pointer hover:opacity-100 hover:shadow-md border rounded-md mx-1 mb-4 p-4',
        !font.isNew && 'opacity-60'
      )}
    >
      {fontFace && <style>{fontFace}</style>}
      <h3
        className="text-xl mb-4"
        style={font.menu ? { fontFamily: `${font.name}-menu` } : undefined}
      >
        {font.name}
      </h3>
      <div className="flex gap-2">
        {font.category && (
          <span className="h-[fit-content] bg-white border border-gray-200 px-2 py-1 rounded-sm text-xs text-muted-foreground">
            {toHeaderCase(font.category)}
          </span>
        )}
        {font.isNew && (
          <span className="h-[fit-content] bg-green-100 px-2 py-1 rounded-sm text-xs text-green-700">
            New
          </span>
        )}
      </div>
    </div>
  )
}
