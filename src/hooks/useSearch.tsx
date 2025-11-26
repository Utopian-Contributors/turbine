import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  useSearchLibraryLazyQuery,
  type LibrarySearchResult,
} from '../../generated/graphql'

export const useSearch = (initialSearchTerm?: string) => {
  const navigate = useNavigate()
  const [searchLibraryQuery] = useSearchLibraryLazyQuery()
  const [results, setResults] = useState<LibrarySearchResult[]>([])
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

      navigate('/search?q=' + term)

      setSearchTimeout(
        setTimeout(
          () =>
            searchLibraryQuery({ variables: { term } }).then(({ data }) =>
              setResults(data?.searchLibrary || [])
            ),
          500
        )
      )
    },
    [navigate, searchLibraryQuery, searchTimeout]
  )

  useEffect(() => {
    if (initialSearchTerm && initialSearchTerm?.trim().length !== 0) {
      search(initialSearchTerm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchTerm])

  return { results, search }
}
