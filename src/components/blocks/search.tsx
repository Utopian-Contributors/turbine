import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import React, { useRef } from 'react'
import { Input } from '../ui/input'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void
  placeholder: string
  className?: string
  defaultValue?: string
}

const Search: React.FC<SearchProps> = ({
  onChange,
  placeholder,
  className,
  defaultValue,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="w-full lg:w-fit mx-auto flex gap-1 items-center">
      <Input
        className={cn(
          `w-md bg-white/40 backdrop-blur-xs m-0 p-6 text-lg rounded-full ${className}`
        )}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        defaultValue={defaultValue}
        ref={ref}
        {...props}
      />
      <div className={cn("relative right-12 p-1 bg-primary/4 rounded-full", ref.current?.value ? 'visible' : 'invisible')}>
        <XIcon
          className="h-4 w-4 cursor-pointer text-gray-500/50"
          onClick={() => {
            onChange('')
            if (ref.current) {
              ref.current.value = ''
              ref.current.focus()
            }
          }}
        />
      </div>
    </div>
  )
}

export default Search
