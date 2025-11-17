import { useCallback, useState } from 'react'

export const useFetchLibrary = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [library, setLibrary] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const fetchLibrary = useCallback((term: string) => {
    setLoading(true)
    return fetch(`https://registry.npmjs.org/${term}`)
    .then((res) => res.json())
    .then((data) => {
        setLoading(false)
        setLibrary(data)
        return data
      }).catch((error) => {
        console.error('Error fetching library:', error)
        setLoading(false)
      })
  }, [])

  return { fetchLibrary, loading, library }
}
