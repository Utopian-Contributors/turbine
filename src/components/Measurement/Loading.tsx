import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'
import AutoProgress from '../ui/auto-progress'

interface LoadingProps {
  dark?: boolean
}

export const LoadingMeasurement: React.FC<LoadingProps> = ({ dark }) => {
  return (
    <div className="flex flex-col items-center gap-2 my-6">
      <div
        className={cn(
          'text-4xl m-6 whitespace-nowrap overflow-hidden',
          dark ? 'text-gray-400' : 'text-white',
        )}
      >
        Measuring website...
      </div>
      <AutoProgress />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          delay: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 4,
        }}
        className="flex flex-col gap-2 mt-6 items-center"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 4,
          }}
          className={cn(
            'text-lg px-3 py-1',
            dark ? 'text-gray-400' : 'text-green-100',
          )}
        >
          Reading SEO metadata
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 4,
          }}
          className={cn(
            'text-lg px-3 py-1',
            dark ? 'text-gray-400' : 'text-green-100',
          )}
        >
          Analyzing the website bundle
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 4,
          }}
          className={cn(
            'text-lg px-3 py-1',
            dark ? 'text-gray-400' : 'text-green-100',
          )}
        >
          Measuring image dimensions
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 4,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 4,
          }}
          className={cn(
            'text-lg px-3 py-1',
            dark ? 'text-gray-400' : 'text-green-100',
          )}
        >
          Tracking performance
        </motion.span>
      </motion.div>
    </div>
  )
}

export default LoadingMeasurement
