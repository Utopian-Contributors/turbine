import { gql, useQuery } from '@apollo/client'
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Globe,
  Loader2,
  MessageSquare,
  Rss,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  useAddCollectionItemsMutation,
  useCollectionQuery,
  useDeleteCollectionMutation,
  useRemoveCollectionItemMutation,
  useUpdateCollectionMutation,
} from '../../generated/graphql'

const READER_SEARCH_QUERY = gql`
  query ReaderSearchForCollection($query: String!, $pagination: PaginationInput) {
    readerIndex(query: $query, pagination: $pagination) {
      id
      url
      seoTitle
      faviconPath
    }
  }
`

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, refetch } = useCollectionQuery({
    variables: { id: id ?? '' },
    skip: !id,
  })

  const [updateCollection] = useUpdateCollectionMutation()
  const [addItems] = useAddCollectionItemsMutation()
  const [removeItem] = useRemoveCollectionItemMutation()
  const [deleteCollection] = useDeleteCollectionMutation()

  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const collection = data?.collection

  useEffect(() => {
    if (collection) {
      document.title = `${collection.name} | Utopian`
    }
  }, [collection])

  const handleTogglePublic = useCallback(async () => {
    if (!collection) return
    await updateCollection({
      variables: { id: collection.id, isPublic: !collection.isPublic },
    })
    refetch()
  }, [collection, updateCollection, refetch])

  const handleCopyShareLink = useCallback(() => {
    if (!collection) return
    const url = `${window.location.origin}/collections/share/${collection.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [collection])

  const handleRemoveItem = useCallback(
    async (itemId: string) => {
      if (!collection) return
      await removeItem({ variables: { collectionId: collection.id, itemId } })
      refetch()
    },
    [collection, removeItem, refetch],
  )

  const handleDelete = useCallback(async () => {
    if (!collection) return
    await deleteCollection({ variables: { id: collection.id } })
    navigate('/collections')
  }, [collection, deleteCollection, navigate])

  const handleDownload = useCallback(async () => {
    if (!collection) return
    const items = collection.items.filter((i) => i.jobId)
    if (items.length === 0) {
      setError('No items have been processed yet for download')
      return
    }

    setDownloading(true)
    setError(null)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      for (const item of items) {
        try {
          const response = await fetch(`/api/reader/${item.jobId}`)
          if (response.ok) {
            const content = await response.text()
            const filename = new URL(item.url).pathname.replace(/\//g, '_') || 'index'
            zip.file(`${filename}.html`, content)
          }
        } catch {
          // Skip items that fail to fetch
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${collection.name}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setDownloading(false)
    }
  }, [collection])

  const handleChat = useCallback(() => {
    if (!collection) return
    navigate(`/agent/new?collectionId=${encodeURIComponent(collection.id)}`)
  }, [collection, navigate])

  // Fuzzy search for adding items
  const { data: searchData } = useQuery(READER_SEARCH_QUERY, {
    variables: { query: searchQuery, pagination: { take: 8 } },
    skip: searchQuery.trim().length < 2,
    fetchPolicy: 'cache-first',
  })

  const searchResults = (searchData?.readerIndex ?? []) as Array<{
    id: string
    url: string
    seoTitle: string | null
    faviconPath: string | null
  }>

  // Filter out URLs already in the collection
  const existingUrls = new Set(collection?.items.map((i) => i.url) ?? [])
  const filteredResults = searchResults.filter((r) => !existingUrls.has(r.url))

  const handleAddFromSearch = useCallback(
    async (url: string) => {
      if (!collection) return
      await addItems({ variables: { collectionId: collection.id, urls: [url] } })
      setSearchQuery('')
      setSearchOpen(false)
      refetch()
    },
    [collection, addItems, refetch],
  )

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const apiBase =
    import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '').replace('/graphql', '') ||
    'http://localhost:4000'

  if (!collection) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center apple-page">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--apple-text-muted)' }} />
      </div>
    )
  }

  const processedCount = collection.items.filter((i) => i.jobId).length

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        {/* Back + Header */}
        <button
          onClick={() => navigate('/collections')}
          className="flex items-center gap-1.5 text-[12px] font-medium mb-4"
          style={{ color: 'var(--apple-text-secondary)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Collections
        </button>

        <div className="rounded-xl p-5 mb-4 apple-panel">
          <div className="flex items-center gap-3 mb-1">
            {(() => {
              const favicon = collection.items.find((i) => i.faviconPath)?.faviconPath
              return favicon ? (
                <img src={favicon} alt="" className="w-7 h-7 rounded-md shrink-0" />
              ) : null
            })()}
            <h1
              className="text-[22px] font-bold"
              style={{ color: 'var(--apple-text-primary)' }}
            >
              {collection.name}
            </h1>
          </div>
          {collection.description && (
            <p className="text-[13px] mb-3" style={{ color: 'var(--apple-text-secondary)' }}>
              {collection.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px]" style={{ color: 'var(--apple-text-secondary)' }}>
              {collection.items.length} URL{collection.items.length !== 1 ? 's' : ''}
            </span>
            {processedCount > 0 && (
              <>
                <span className="text-[10px]" style={{ color: 'var(--apple-text-faint)' }}>&middot;</span>
                <span className="text-[10px]" style={{ color: 'var(--apple-text-secondary)' }}>
                  {processedCount} processed
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleTogglePublic}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn"
          >
            <Globe className="w-3.5 h-3.5" />
            {collection.isPublic ? 'Public' : 'Private'}
          </button>
          {collection.isPublic && (
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading || processedCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn disabled:opacity-40"
          >
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download
          </button>
          <button
            onClick={handleChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>
          {collection.isPublic && (
            <a
              href={`${apiBase}/collections/rss/${collection.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn"
            >
              <Rss className="w-3.5 h-3.5" />
              RSS
            </a>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn ml-auto"
            style={{ color: '#ff453a' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

        {error && (
          <p className="text-[11px] mb-4 font-medium" style={{ color: '#ff453a' }}>
            {error}
          </p>
        )}

        {/* URL list */}
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--apple-text-muted)' }}
        >
          URLs
        </p>
        {collection.items.length > 0 ? (
          <div className="rounded-xl apple-panel-soft mb-4">
            {collection.items.map((item, i) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 px-4 py-3 group"
                style={i > 0 ? { borderTop: '1px solid var(--apple-border)' } : undefined}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                    {item.title || item.url}
                  </p>
                  {item.description && (
                    <p
                      className="text-[11px] mt-0.5 line-clamp-2"
                      style={{ color: 'var(--apple-text-secondary)' }}
                    >
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] font-mono truncate" style={{ color: 'var(--apple-text-muted)' }}>
                      {item.url}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                  style={{ color: 'var(--apple-text-muted)' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl px-5 py-8 text-center apple-panel-soft mb-4">
            <p className="text-[13px]" style={{ color: 'var(--apple-text-secondary)' }}>
              No URLs in this collection yet. Use the search below to add pages.
            </p>
          </div>
        )}

        {/* Add items via search */}
        <div ref={searchRef} className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{
            background: 'var(--apple-bg-input)',
            border: '1px solid var(--apple-border)',
          }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--apple-text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchOpen(e.target.value.trim().length >= 2)
              }}
              onFocus={() => { if (searchQuery.trim().length >= 2) setSearchOpen(true) }}
              placeholder="Search archived pages to add..."
              className="flex-1 text-[13px] font-medium outline-none bg-transparent"
              style={{ color: 'var(--apple-text-primary)' }}
            />
          </div>
          {searchOpen && filteredResults.length > 0 && (
            <div
              className="absolute z-10 left-0 right-0 mt-1 rounded-xl overflow-y-auto shadow-lg"
              style={{
                background: 'var(--apple-bg-panel)',
                border: '1px solid var(--apple-border)',
                maxHeight: 'min(360px, 50vh)',
              }}
            >
              {filteredResults.map((result, i) => (
                <button
                  key={result.id}
                  onClick={() => handleAddFromSearch(result.url)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={i > 0 ? { borderTop: '1px solid var(--apple-border)' } : undefined}
                >
                  {result.faviconPath ? (
                    <img src={result.faviconPath} alt="" className="w-4 h-4 rounded-sm shrink-0" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--apple-text-muted)' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                      {result.seoTitle || result.url}
                    </p>
                    <p className="text-[10px] font-mono truncate" style={{ color: 'var(--apple-text-muted)' }}>
                      {result.url}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollectionDetailPage
