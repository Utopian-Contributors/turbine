import { useCallback, useState } from 'react'

export const useFetchReadme = () => {
  const [readme, setReadme] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchReadme = useCallback((github: string) => {
    setLoading(true)
    fetch(github)
      .then((res) => res.text())
      .then((data) => {
        setReadme(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching README:', error)
        setLoading(false)
      })
  }, [])

  return { fetchReadme, loading, readme }
}
