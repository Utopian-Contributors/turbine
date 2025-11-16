import { cn } from '@/lib/utils'
import React from 'react'
import { Input } from '../ui/input'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchProps {
  onChange: (value: string) => void
  className?: string
  defaultValue?: string
}

const Search: React.FC<SearchProps> = ({
  onChange,
  className,
  defaultValue,
}) => {
  return (
    <div>
      <Input
        className={cn(`max-w-[300px] ${className}`)}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search npm packages"
        defaultValue={defaultValue}
      />
    </div>
  )
}

export default Search
