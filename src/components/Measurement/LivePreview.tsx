import { getConnectionIcon } from '@/helpers/icons'
import { cn } from '@/lib/utils'
import { filesize } from 'filesize'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, Package, Timer } from 'lucide-react'
import moment from 'moment'
import React, { useMemo } from 'react'
import type { LatestMeasurementsQuery } from '../../../generated/graphql'

type Measurement = NonNullable<
  LatestMeasurementsQuery['latestMeasurements']
>[number]

interface LivePreviewProps {
  measurements: Measurement[]
}

const MeasurementCard: React.FC<{
  measurement: Measurement
  index: number
  total: number
}> = ({ measurement, index, total }) => {
  const bundleBreakdown = useMemo(() => {
    const breakdown = {
      scripts: 0,
      styles: 0,
      fonts: 0,
      images: 0,
    }

    measurement.bundledFiles.forEach((file) => {
      const size = parseInt(file.size || '0')
      const type = file.type.toLowerCase()

      if (
        type.includes('javascript') ||
        type.includes('script') ||
        file.url.endsWith('.js')
      ) {
        breakdown.scripts += size
      } else if (
        type.includes('css') ||
        type.includes('stylesheet') ||
        file.url.endsWith('.css')
      ) {
        breakdown.styles += size
      } else if (
        type.includes('font') ||
        type.includes('woff') ||
        type.includes('ttf')
      ) {
        breakdown.fonts += size
      } else if (
        type.includes('image') ||
        type.includes('png') ||
        type.includes('jpg') ||
        type.includes('jpeg') ||
        type.includes('gif') ||
        type.includes('svg') ||
        type.includes('webp')
      ) {
        breakdown.images += size
      }
    })

    return breakdown
  }, [measurement.bundledFiles])

  const totalSize = useMemo(() => {
    return Object.values(bundleBreakdown).reduce((acc, val) => acc + val, 0)
  }, [bundleBreakdown])

  const url = useMemo(() => {
    try {
      return new URL(measurement.url)
    } catch {
      return null
    }
  }, [measurement.url])

  // Calculate transform based on stack position
  const zIndex = total - index
  const scale = 1 - index * 0.05
  const yOffset = 20 * index
  const opacity = 1 - index * 0.1

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: -50 }}
      animate={{
        scale,
        y: yOffset,
        opacity,
        zIndex,
      }}
      exit={{ scale: 0.8, opacity: 0, y: 50 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      className={cn(
        'absolute top-0 left-0 right-0 bg-gradient-to-b from-green-500/70 to-green-700/70 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6 shadow-2xl',
      )}
      style={{
        transformOrigin: 'top center',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
          {measurement.icon ? (
            <img
              src={measurement.icon}
              alt={measurement.host?.host || 'Website'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML =
                  '<svg class="w-8 h-8 text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>'
              }}
            />
          ) : (
            <Globe className="w-8 h-8 text-white/60" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="max-w-72 text-white font-semibold text-md truncate">
                {measurement.title || measurement.host?.host || 'Unknown'}
              </h3>
              <p className="text-green-100/70 text-sm truncate">
                {url?.host || measurement.host?.host}
                <span className="text-green-100/50">{url?.pathname}</span>
              </p>
              <div className="flex gap-4 mt-3">
                {measurement.elapsed && (
                  <div className="flex gap-1 items-center rounded-sm text-right">
                    {getConnectionIcon(
                      measurement.connectionType,
                      'h-3 w-3 text-white',
                    )}
                    <div className="text-xs text-white">
                      {measurement.connectionType}
                    </div>
                  </div>
                )}
                {measurement.elapsed && (
                  <div className="flex gap-1 items-center rounded-sm text-right">
                    <Timer className='h-3 w-3 text-white'/>
                    <div className="text-xs text-white">
                      {(measurement.elapsed / 1000).toFixed(2)}s
                    </div>
                  </div>
                )}
                {measurement.elapsed && (
                  <div className="flex gap-1 items-center rounded-sm text-right">
                    <Package className='h-3 w-3 text-white'/>
                    <div className="text-xs text-white">
                      {filesize(totalSize, { standard: 'jedec' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="absolute right-6 text-sm text-gray-200/50 font-bold">
              {moment(measurement.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const LivePreview: React.FC<LivePreviewProps> = ({ measurements }) => {
  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      style={{ height: '300px' }}
    >
      <AnimatePresence mode="popLayout">
        {measurements.map((measurement, index) => (
          <MeasurementCard
            key={measurement.id}
            measurement={measurement}
            index={index}
            total={measurements.length}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
