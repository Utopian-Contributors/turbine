import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { StarIcon } from 'lucide-react'
import React from 'react'

interface StarRatingProps {
  rating?: number
  size?: number
  classname?: string
  animated?: boolean
  grayscale?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 24,
  classname,
  animated = true,
  grayscale = false,
}) => {
  return (
    <div className={`flex gap-1 ${classname}`}>
      {Array.from({ length: rating ?? 0 }).map((_, index) => (
        <motion.div
          initial={animated ? { scale: 0 } : undefined}
          animate={animated ? { scale: 1 } : undefined}
          transition={{ delay: 0 + index * 0.2 }}
          key={index}
        >
          <StarIcon
            key={index}
            size={size}
            className={cn(
              'fill-amber-300 text-amber-300',
              grayscale
                ? index === (rating ?? 0) - 1
                  ? 'grayscale text-gray-400'
                  : 'grayscale'
                : undefined
            )}
          />
        </motion.div>
      ))}
      {Array.from({ length: 5 - (rating ?? 0) }).map((_, index) => (
        <div key={index}>
          <StarIcon key={index} size={size} className="text-gray-300" />
        </div>
      ))}
    </div>
  )
}

export default StarRating
