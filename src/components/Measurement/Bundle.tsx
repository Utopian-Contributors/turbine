import { Accordion } from '@radix-ui/react-accordion'
import type { MeasuredFileFragment, Measurement } from 'generated/graphql'
import React, { useMemo } from 'react'
import BundledFileSection from './BundledFileSection'

export interface BundledFileProps {
  baseUrl: string
  url: string
  contentType: string
  size: number
  elapsed: number
  width?: number
  height?: number
  clientWidth?: number
  clientHeight?: number
}

interface BundleProps {
  measurement:
    | (Pick<Measurement, 'redirect' | 'url'> & {
        bundledFiles: MeasuredFileFragment[]
      })
    | null
    | undefined
}

const Bundle: React.FC<BundleProps> = ({ measurement }) => {
  const files = useMemo(() => {
    if (
      (measurement?.redirect || measurement?.url) &&
      measurement?.bundledFiles
    ) {
      return (
        [...(measurement?.bundledFiles ?? [])]
          .sort((a, b) => Number(b.size) - Number(a.size))
          .map((file) => ({
            id: file.id,
            baseUrl: (measurement?.redirect || measurement?.url)!,
            url: file.url,
            contentType: file.type,
            size: Number(file.size),
            elapsed: file.elapsed,
            width: file.width || undefined,
            height: file.height || undefined,
            clientWidth: file.clientWidth || undefined,
            clientHeight: file.clientHeight || undefined,
          })) || []
      )
    }
    return []
  }, [measurement?.bundledFiles, measurement?.redirect, measurement?.url])

  const scripts = useMemo(
    () => files.filter((file) => file.contentType.startsWith('js')),
    [files]
  )
  const styles = useMemo(
    () => files.filter((file) => file.contentType.startsWith('css')),
    [files]
  )
  const fonts = useMemo(
    () => files.filter((file) => file.contentType.startsWith('font')),
    [files]
  )
  const images = useMemo(
    () => files.filter((file) => file.contentType.startsWith('image')),
    [files]
  )

  return (
    <Accordion type="single" collapsible className="w-full">
      {scripts.length > 0 && (
        <BundledFileSection type="scripts" files={scripts} label="Scripts" />
      )}
      {styles.length > 0 && (
        <BundledFileSection type="styles" files={styles} label="Styles" />
      )}
      {fonts.length > 0 && (
        <BundledFileSection type="fonts" files={fonts} label="Fonts" />
      )}
      {images.length > 0 && (
        <BundledFileSection type="images" files={images} label="Images" />
      )}
    </Accordion>
  )
}

export default Bundle
