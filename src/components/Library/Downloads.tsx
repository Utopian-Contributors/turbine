import { useFetchDownloads } from '@/hooks/useFetchDownloads'
import { cn } from '@/lib/utils'
import { abbreviateNumber } from 'js-abbreviation-number'
import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

interface DownloadsProps {
  library?: string
}

const Downloads: React.FC<DownloadsProps> = ({ library }) => {
  const { fetchDownloads, downloads } = useFetchDownloads()
  const [prevDownloads, setPrevDownloads] = useState<number | null>(null)

  useEffect(() => {
    if (library) {
      fetchDownloads(library).then(() => {
        const previousWeekEnd = moment()
          .subtract(1, 'week')
          .format('YYYY-MM-DD')
        const previousWeekStart = moment()
          .subtract(2, 'week')
          .format('YYYY-MM-DD')
        const previousWeekRange = `${previousWeekStart}:${previousWeekEnd}`
        fetchDownloads(library, previousWeekRange).then((prevDownloads) => {
          setPrevDownloads(prevDownloads)
        })
      })
    }
  }, [library, fetchDownloads])

  return (
    <div className="hidden md:flex flex-col items-start gap-1 mx-8 p-4 border rounded-xl">
      <p>NPM downloads last week: </p>
      <p className="text-4xl">
        {downloads !== null ? abbreviateNumber(downloads) : 'Loading...'}
      </p>
      {prevDownloads !== null && downloads !== null && (
        <div
          className={cn(
            'flex gap-1',
            downloads > prevDownloads
              ? 'text-green-500'
              : downloads < prevDownloads
              ? 'text-red-500'
              : 'text-yellow-500'
          )}
        >
          {downloads > prevDownloads ? (
            <TrendingUp width={20} className="inline-block mb-1 mr-1" />
          ) : downloads < prevDownloads ? (
            <TrendingDown width={20} className="inline-block mb-1 mr-1" />
          ) : (
            <MoveRight width={20} className="inline-block mb-1 mr-1" />
          )}
          <p>{abbreviateNumber(downloads - prevDownloads)}</p>
        </div>
      )}
    </div>
  )
}

export default Downloads
