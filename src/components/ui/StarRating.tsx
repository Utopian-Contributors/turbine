import { StarIcon } from 'lucide-react'
import React from 'react'

interface StarRatingProps {
  rating: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, index) => (
        <StarIcon
          key={index}
          size={24}
          className="fill-amber-300 text-amber-300"
        />
      ))}
      {Array.from({ length: 5 - rating }).map((_, index) => (
        <StarIcon
          key={index}
          size={24}
          className="text-gray-300"
        />
      ))}
    </div>
  )
}

export default StarRating
