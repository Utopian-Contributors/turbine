import { cn } from '@/lib/utils'
import * as React from 'react'

import { Search } from 'lucide-react'
import { Button } from './button'
import './input.css'

interface SearchWebsiteProps extends React.ComponentProps<'input'> {
  onSearch: (value: string) => void
  initial?: string
}

const SearchWebsite = React.forwardRef<HTMLInputElement, SearchWebsiteProps>(
  ({ className, type, onSearch, initial, ...props }, ref) => {
    const [value, setValue] = React.useState('https://')

    React.useEffect(() => {
      if (initial) {
        setValue(initial)
      }
    }, [initial])

    return (
      <div
        className={cn(
          'bg-background max-w-md flex items-center gap-1 rounded-full border border-input p-2 mx-auto shadow-sm shadow-black/5 transition-shadow',
          className
        )}
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
            }
            setValue(e.target.value)
          }}
          className={cn(
            'flex h-9 w-full h-[40px] bg-background px-3 text-md text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            type === 'search' &&
              '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
            type === 'file' &&
              'p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground',
            value === 'https://' && 'text-muted-foreground/70'
          )}
          ref={ref}
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
    )
  }
)
SearchWebsite.displayName = 'SearchWebsite'

export { SearchWebsite }
