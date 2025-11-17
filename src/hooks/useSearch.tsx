import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export interface SearchResult {
  id: number
  name: string
  description: string
  latestVersion?: string
  updated: string
  downloads: number
  links: {
    repository?: string
    npm?: string
    homepage?: string
  }
}

export const useSearch = (initialSearchTerm?: string) => {
  const navigate = useNavigate()
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const search = useCallback(
    (term: string) => {
      if (term.trim().length === 0) {
        setResults([])
        return
      }

      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      setSearchTimeout(
        setTimeout(() => {
          fetch(`https://registry.npmjs.org/-/v1/search?text=${term}&size=10`)
            .then((res) => res.json())
            .then((data) => {
              navigate('/search?q=' + term)
              setResults(
                data.objects.map(
                  (
                    obj: {
                      downloads: { weekly: number }
                      package: {
                        name: string
                        description: string
                        version: string
                        date: string
                        links: {
                          npm: string
                          repository?: string
                          homepage?: string
                        }
                      }
                    },
                    index: number
                  ) => ({
                    id: index,
                    name: obj.package.name,
                    description: obj.package.description,
                    downloads: obj.downloads.weekly,
                    latestVersion: obj.package.version,
                    updated: obj.package.date,
                    links: obj.package.links,
                  })
                )
              )
            })
        }, 500)
      )
    },
    [navigate, searchTimeout]
  )

  useEffect(() => {
    if (initialSearchTerm && initialSearchTerm?.trim().length !== 0) {
      search(initialSearchTerm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchTerm])

  return { results, search }
}
