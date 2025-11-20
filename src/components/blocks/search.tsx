import { cn } from '@/lib/utils'
import { CircleXIcon } from 'lucide-react'
import React, { useRef } from 'react'
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
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="w-[420px] relative transform -translate-x-1/2 left-1/2 flex gap-1 items-center">
      <Input
        className={cn(`w-[420px] m-0 p-6 text-lg rounded-full ${className}`)}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search npm packages"
        defaultValue={defaultValue}
        ref={ref}
        {...props}
      />
      {ref.current?.value ? (
        <CircleXIcon
          className="cursor-pointer relative right-12 fill-gray-300 text-white"
          onClick={() => {
            onChange('')
            if (ref.current) {
              ref.current.value = ''
              ref.current.focus()
            }
          }}
        />
      ) : null}
    </div>
  )
}

export default Search
