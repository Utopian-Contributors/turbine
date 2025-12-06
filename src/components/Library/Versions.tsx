import React from 'react'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface VersionsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  versions: Record<string, any>
  latest: string | null
  selected?: string | null
  onChange?: (value: string) => void
}

const Versions: React.FC<VersionsProps> = ({
  versions,
  selected,
  latest,
  onChange,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="versions">Version</Label>
      <Select value={selected ?? undefined} onValueChange={onChange}>
        <SelectTrigger id="versions">
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(versions)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((major) => [
              <SelectGroup key={major}>
                <SelectLabel>Version {major}</SelectLabel>
                {versions[major].map((version: string) => (
                  <SelectItem key={version} value={version}>
                    {version} {version === latest ? '(latest)' : ''}
                  </SelectItem>
                ))}
              </SelectGroup>,
              <SelectSeparator key={`separator-${major}`} />,
            ])}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Versions
