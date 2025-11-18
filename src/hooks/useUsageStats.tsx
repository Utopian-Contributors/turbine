import { useCallback, useState } from 'react'

export interface UsageStats {
  bandwidth: {
    rank: number
    total: number
  }
}

export const useUsageStats = () => {
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchUsageStats = useCallback(
    (packageName: string, timespan?: string) => {
      setLoading(true)
      return fetch(
        `https://data.jsdelivr.com/v1/stats/packages/npm/${packageName}?period=${
          timespan || 'week'
        }`
      )
        .then((res) => res.json())
        .then((data) => {
          setLoading(false)
          if (data && data.bandwidth && !timespan) {
            setUsage({
              bandwidth: {
                rank: data.bandwidth.rank,
                total: data.bandwidth.total,
              },
            })
          }
          return data
        })
        .catch((error) => {
          console.error('Error fetching usage stats:', error)
          setLoading(false)
        })
    },
    []
  )

  return { fetchUsageStats, loading, usage }
}
