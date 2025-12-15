import { filesize } from 'filesize'
import { ImageIcon, Package, Palette, TypeIcon } from 'lucide-react'
import React, { type JSX } from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import type { BundledFileProps } from './Bundle'
import File from './BundledFile'

interface BundledFileSectionProps {
  label: string
  type: 'images' | 'fonts' | 'scripts' | 'styles' | 'others'
  files: BundledFileProps[]
}

const getContentTypeIcon = (type: string) => {
  let icon: JSX.Element | null = null
  let background = 'black'
  let borderColor = 'black'

  if (type === 'fonts') {
    icon = <TypeIcon />
    background = 'dodgerblue'
    borderColor = 'dodgerblue'
  } else if (type === 'images') {
    icon = <ImageIcon />
    background =
      'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)'
    borderColor = '#667eea'
  } else if (type === 'scripts') {
    icon = <Package />
    background = 'orange'
    borderColor = 'orange'
  } else if (type === 'styles') {
    icon = <Palette />
    background = 'purple'
    borderColor = 'purple'
  }

  return (
    <div
      className={`border-2 rounded-md p-2`}
      style={{
        borderColor: borderColor,
        background: background,
        color: 'white',
      }}
    >
      {icon}
    </div>
  )
}

const BundledFileSection: React.FC<BundledFileSectionProps> = ({ label, type, files }) => {
  return (
    <AccordionItem value={type}>
      <AccordionTrigger className="hover:no-underline hover:bg-gray-100 p-2">
        <div className="flex gap-2">
          {getContentTypeIcon(type)}
          <div className="flex flex-col">
            {label}
            <div className='flex text-muted-foreground gap-1'>
              <span className="font-normal">
                {files.length} files •
              </span>
              <span className="font-normal">
                {filesize(files.reduce((acc, file) => acc + file.size, 0))}{' '}
                total
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 p-4 pt-2">
        {files.map((file) => (
          <File key={file.url} {...file} />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export default BundledFileSection
