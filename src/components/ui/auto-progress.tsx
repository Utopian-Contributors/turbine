import { motion } from 'framer-motion'
import React from 'react'

const AutoProgress: React.FC = () => {
  return (
    <div className="relative w-xs lg:w-sm h-3 rounded-full shadow-sm ring-1 ring-green-600 overflow-hidden">
      <motion.div
        id="progress"
        initial={{ left: '-50%' }}
        animate={{ left: `0%` }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'linear',
          type: 'tween',
        }}
        className="absolute w-[150%] h-full bg-gradient-to-l from-green-400 from-40% to-green-600 bg-size-[40px] blur-[6px] bg-repeat-x"
      />
      <div id="background" className="bg-gray-200 w-full h-full" />
    </div>
  )
}

export default AutoProgress
