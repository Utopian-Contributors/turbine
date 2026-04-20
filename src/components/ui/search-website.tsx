import { cn } from '@/lib/utils'
import * as React from 'react'

import { Search } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from './button'
import './input.css'

interface SearchWebsiteProps extends React.ComponentProps<'input'> {
  onSearch: (value: string) => void
  initial?: string
  autoFocus?: boolean
}

const SearchWebsite = React.forwardRef<HTMLInputElement, SearchWebsiteProps>(
  ({ className, type, onSearch, initial, autoFocus, ...props }) => {
    const [value, setValue] = React.useState('https://')
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
      if (initial) {
        setValue(initial)
      }
    }, [initial])

    return (
      <div className="w-full sticky top-6 z-10">
        <div
          key="search-input"
          className={cn(
            'bg-background/50 backdrop-blur-sm max-w-md flex items-center gap-1 rounded-full border border-input p-2 mx-auto shadow-sm shadow-black/5 transition-shadow',
            className,
          )}
          style={{
            background:
              'linearGradient(rgb(255, 255, 255) 0%, rgb(244, 241, 235) 100%)',
          }}
        >
          <input
            type={type}
            value={value}
            onChange={(e) => {
              if (e.target.value === '') {
                setValue('https://')
                return
              } else if (e.target.value.startsWith('https://https://')) {
                setValue(e.target.value.replace('https://https://', 'https://'))
                return
              } else if (!e.target.value.startsWith('https://')) {
                setValue('https://' + e.target.value)
              } else if (e.target.value.startsWith('http://')) {
                setValue('https://' + e.target.value)
                return
              } else {
                setValue(e.target.value)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(value)
              }
            }}
            className={cn(
              'flex h-9 w-full h-[40px] px-3 text-md text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              type === 'search' &&
                '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
              value === 'https://' && 'text-muted-foreground/70',
            )}
            ref={inputRef}
            autoFocus={autoFocus}
            placeholder="Enter a URL to optimize..."
            {...props}
          />
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-2 mr-2"
            onClick={() => onSearch(value)}
          >
            <Search className="text-muted-foreground" />
          </Button>
        </div>
      </div>
    )
  },
)
SearchWebsite.displayName = 'SearchWebsite'

export { SearchWebsite }
