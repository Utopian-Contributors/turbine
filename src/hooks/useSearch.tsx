import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  useSearchFontsLazyQuery,
  useSearchLibraryLazyQuery,
  type FontSearchResultFragment,
  type LibrarySearchResult,
} from '../../generated/graphql'

export const useSearch = (initialSearchTerm?: string) => {
  const navigate = useNavigate()
  const [searchLibraryQuery] = useSearchLibraryLazyQuery()
  const [searchFonts] = useSearchFontsLazyQuery()
  const [fontSearchResults, setFontSearchResults] = useState<
    FontSearchResultFragment[]
  >([])
  const [librarySearchResults, setLibrarySearchResults] = useState<
    LibrarySearchResult[]
  >([])
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const search = useCallback(
    (term: string) => {
      if (term.trim().length === 0) {
        setLibrarySearchResults([])
        setFontSearchResults([])
        return
      }

      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      const search = new URLSearchParams(location.search)
      search.set('q', term)
      if (
        location.pathname === '/libraries' ||
        location.pathname.startsWith('/l')
      ) {
        search.set('s', 'lib')
      }
      if(location.pathname.startsWith('/fonts')) {
        search.set('s', 'font')
      }

      if (location.pathname !== '/search') {
        navigate('/search?' + search.toString())
      } else {
        navigate('/search?' + search.toString(), { replace: true })
      }

      setSearchTimeout(
        setTimeout(() => {
          searchFonts({ variables: { term } }).then(({ data }) =>
            setFontSearchResults(data?.searchFonts || [])
          )
          searchLibraryQuery({ variables: { term } }).then(({ data }) =>
            setLibrarySearchResults(data?.searchLibrary || [])
          )
        }, 500)
      )
    },
    [navigate, searchFonts, searchLibraryQuery, searchTimeout]
  )

  useEffect(() => {
    if (initialSearchTerm && initialSearchTerm?.trim().length !== 0) {
      search(initialSearchTerm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchTerm])

  return { librarySearchResults, fontSearchResults, search }
}
