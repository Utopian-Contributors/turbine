import { cn } from '@/lib/utils'
import React from 'react'
import { Input } from '../ui/input'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void
  className?: string
  defaultValue?: string
}

const Search: React.FC<SearchProps> = ({
  onChange,
  className,
  defaultValue,
  ...props
}) => {
  return (
    <div>
      <Input
        className={cn(`max-w-[420px] p-6 text-lg rounded-full ${className}`)}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search npm packages"
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  )
}

export default Search
