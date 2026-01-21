import { cn } from '@/lib/utils'
import * as React from 'react'

import { Globe, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router'
import { useWebsitesQuery } from '../../../generated/graphql'
import { Button } from './button'
import './input.css'

interface SearchWebsiteProps extends React.ComponentProps<'input'> {
  onSearch: (value: string) => void
  initial?: string
  autoFocus?: boolean
}

const SearchWebsite = React.forwardRef<HTMLInputElement, SearchWebsiteProps>(
  ({ className, type, onSearch, initial, autoFocus, ...props }) => {
    const [value, setValue] = React.useState('https://')
    const inputRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const {
      data: websitesQueryData,
      refetch,
      fetchMore: fetchMoreWebsites,
    } = useWebsitesQuery({ variables: { pagination: { take: 12 } } })
    const [hasMoreWebsites, setHasMoreWebsites] = useState(true)

    const loadMoreWebsites = useCallback(() => {
      if (hasMoreWebsites) {
        fetchMoreWebsites({
          variables: {
            pagination: {
              skip: websitesQueryData?.websites?.length,
              take: 10,
            },
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if ((fetchMoreResult.websites?.length ?? 0) < 10) {
              setHasMoreWebsites(false)
            }
            if (
              prev.websites &&
              fetchMoreResult.websites &&
              (fetchMoreResult.websites?.length ?? 0) > 0
            ) {
              return Object.assign({}, prev, {
                websites: [...prev.websites, ...fetchMoreResult.websites],
              })
            }
            return prev
          },
        })
      }
    }, [
      fetchMoreWebsites,
      hasMoreWebsites,
      websitesQueryData?.websites?.length,
    ])

    const { ref: lastWebsiteRef, inView: lastWebsiteRefInView } = useInView()
    useEffect(() => {
      if (lastWebsiteRefInView && hasMoreWebsites) {
        loadMoreWebsites()
      }
    }, [hasMoreWebsites, lastWebsiteRefInView, loadMoreWebsites])

    useEffect(() => {
      if (initial) {
        setValue(initial)
      }
    }, [initial])

    useEffect(() => {
      if (value) {
        refetch({ query: value })
      }
    }, [refetch, value])

    const [focused, setFocused] = useState(false)

    return (
      <div className="w-full sticky top-6 z-10">
        <div
          key="search-input"
          className={cn(
            'bg-background max-w-md flex items-center gap-1 rounded-full border border-input p-2 mx-auto shadow-sm shadow-black/5 transition-shadow',
            className,
          )}
        >
          <input
            type={type}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              if (e.target.value === '') {
                setValue('https://')
                return
              } else if (e.target.value.startsWith('https://https://')) {
                setValue(e.target.value.replace('https://https://', 'https://'))
                return
              } else if (!e.target.value.startsWith('https://')) {
                setValue('https://' + e.target.value)
              } else {
                setValue(e.target.value)
              }
            }}
            className={cn(
              'flex h-9 w-full h-[40px] bg-background px-3 text-md text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              type === 'search' &&
                '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
              type === 'file' &&
                'p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground',
              value === 'https://' && 'text-muted-foreground/70',
            )}
            ref={inputRef}
            autoFocus={autoFocus}
            {...props}
          />
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-2 mr-2"
            onClick={() => onSearch(value)}
          >
            <Search className="text-muted-foreground" />
          </Button>
        </div>
        {websitesQueryData?.websites?.length ? (
          <div
            key="search-suggestions"
            className={cn(
              'w-xs absolute flex flex-col gap-1 px-2 py-3 bg-white/50 border rounded-lg backdrop-blur-md left-1/2 -translate-x-1/2 mt-4 shadow-lg max-h-80 overflow-y-auto transition-opacity duration-200',
              focused ? 'opacity-100 visible' : 'opacity-0 hidden',
            )}
          >
            {websitesQueryData.websites.map((w) => (
              <div
                className="cursor-pointer w-full hover:bg-white/50 transition duration-200 px-3 p-4 rounded-md flex gap-2"
                onClick={() => navigate(`/measurements/${w.host}`)}
                key={w.id}
                ref={
                  websitesQueryData.websites?.length &&
                  w.id ===
                    websitesQueryData.websites[
                      websitesQueryData.websites?.length - 1
                    ].id
                    ? lastWebsiteRef
                    : null
                }
              >
                {w.icon ? (
                  <img src={w.icon} className="h-6 w-6" />
                ) : (
                  <div className="h-6 w-6">
                    <Globe size={24} />
                  </div>
                )}
                <p className="truncate">{w.title ?? w.host}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  },
)
SearchWebsite.displayName = 'SearchWebsite'

export { SearchWebsite }
