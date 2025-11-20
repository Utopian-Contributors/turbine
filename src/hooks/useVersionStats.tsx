import { useState } from 'react';

export const useVersionStats = () => {
  const [versionStats, setVersionStats] = useState<
    { version: string; bandwidth: number }[] | null
  >(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchVersionStats = async (library: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://data.jsdelivr.com/v1/stats/packages/npm/${library}/versions?by=bandwidth&period=week&limit=10`
      )
      const data = await response.json()
      // Mocked data structure for version stats
      const stats = data.map(
        (info: { version: string; bandwidth: { total: number } }) => {
          const { version, bandwidth } = info
          return {
            version: version,
            bandwidth: bandwidth.total,
          }
        }
      )
      setVersionStats(stats)
      return stats
    } catch (error) {
      console.error('Error fetching version stats:', error)
      setVersionStats(null)
    } finally {
      setLoading(false)
    }
  }

  return { versionStats, loading, fetchVersionStats }
}
