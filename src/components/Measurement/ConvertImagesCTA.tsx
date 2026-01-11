import { FileWarning } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../ui/button'

interface ConvertImagesCTAProps {
  host: string
  path: string
}

const ConvertImagesCTA: React.FC<ConvertImagesCTAProps> = ({ host, path }) => {
  const navigate = useNavigate()
  return (
    <div className="border rounded-xl border-amber-600 bg-amber-500/10 p-4">
      <div className="flex gap-2 items-center mb-2">
        <FileWarning className="shrink-0 text-amber-600" size={24} />
        <h2 className="text-lg font-semibold text-amber-600">
          Convert large images
        </h2>
      </div>
      <p>
        Reduce the size of your images to improve page load times and overall
        performance.
      </p>
      <Button
        onClick={() => navigate(`/measurements/${host}/images?path=${path}`)}
        className="mt-4 bg-amber-500 hover:bg-amber-600"
      >
        Convert images
      </Button>
    </div>
  )
}

export default ConvertImagesCTA
