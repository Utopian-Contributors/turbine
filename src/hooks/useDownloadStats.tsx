import { useCallback, useState } from 'react'

export const useDownloadStats = () => {
  const [downloads, setDownloads] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const fetchDownloads = useCallback(
    (packageName: string, timespan?: string) => {
      setLoading(true)
      return fetch(
        `https://api.npmjs.org/downloads/point/${
          timespan || 'last-week'
        }/${packageName}`
      )
        .then((res) => res.json())
        .then((data) => {
          setLoading(false)
          if (data?.downloads !== undefined && !timespan) {
            setDownloads(data.downloads)
            return data.downloads
          }
          if(data?.downloads && timespan){
            return data.downloads
          } else {
            setDownloads(0)
            return 0
          }

        })
        .catch((error) => {
          setLoading(false)
          console.error('Error fetching downloads:', error)
          setDownloads(0)
          return 0
        })
    },
    [setDownloads]
  )

  return { fetchDownloads, loading, downloads }
}
