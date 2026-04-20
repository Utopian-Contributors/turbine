import { useAuth } from '@/contexts/AuthContext'
import { gql, useQuery } from '@apollo/client'
import { FolderOpen, Globe, Library, Loader2, Plus, Rss, Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  useCreateCollectionMutation,
  useMyCollectionsQuery,
} from '../../generated/graphql'

const READER_SEARCH_QUERY = gql`
  query ReaderSearchForNewCollection($query: String!, $pagination: PaginationInput) {
    readerIndex(query: $query, pagination: $pagination) {
      id
      url
      seoTitle
      faviconPath
    }
  }
`

const CollectionsPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, refetch } = useMyCollectionsQuery({
    variables: { userId: user?.id ?? '' },
    skip: !user?.id,
    pollInterval: 30000,
  })

  const [createCollection] = useCreateCollectionMutation()

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [selectedUrls, setSelectedUrls] = useState<Array<{ url: string; title: string | null; faviconPath: string | null }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [creating, setCreating] = useState(false)

  // Search for archived pages
  const { data: searchData } = useQuery(READER_SEARCH_QUERY, {
    variables: { query: searchQuery, pagination: { take: 8 } },
    skip: searchQuery.trim().length < 2,
    fetchPolicy: 'cache-first',
  })
  const searchResults = (searchData?.readerIndex ?? []) as Array<{
    id: string; url: string; seoTitle: string | null; faviconPath: string | null
  }>
  const selectedUrlSet = new Set(selectedUrls.map((s) => s.url))
  const filteredResults = searchResults.filter((r) => !selectedUrlSet.has(r.url))

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.title = 'Utopian | Collections'
  }, [])

  const handleCreate = useCallback(async () => {
    if (!user?.id || !user?.walletAddress || !name.trim()) return
    const urls = selectedUrls.map((s) => s.url)
    setCreating(true)
    try {
      const { data: result } = await createCollection({
        variables: {
          userId: user.id,
          walletAddress: user.walletAddress,
          name: name.trim(),
          urls,
        },
      })
      if (result?.createCollection?.id) {
        navigate(`/collections/${result.createCollection.id}`)
      } else {
        refetch()
        setShowCreate(false)
        setName('')
        setSelectedUrls([])
      }
    } finally {
      setCreating(false)
    }
  }, [user, name, selectedUrls, createCollection, navigate, refetch])

  const collections = data?.myCollections ?? []
  const apiBase =
    import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '').replace('/graphql', '') ||
    'http://localhost:4000'

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--apple-text-muted)' }}
          >
            Collections
          </p>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold apple-secondary-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {showCreate && (
          <div className="rounded-xl p-5 mb-4 apple-panel">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name"
              className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium outline-none mb-3"
              style={{
                background: 'var(--apple-bg-input)',
                color: 'var(--apple-text-primary)',
                border: '1px solid var(--apple-border)',
              }}
              autoFocus
            />
            {/* Selected pages */}
            {selectedUrls.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedUrls.map((item) => (
                  <span
                    key={item.url}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
                    style={{
                      background: 'var(--apple-bg-input)',
                      color: 'var(--apple-text-primary)',
                      border: '1px solid var(--apple-border)',
                    }}
                  >
                    {item.faviconPath && (
                      <img src={item.faviconPath} alt="" className="w-3 h-3 rounded-sm" />
                    )}
                    <span className="truncate max-w-[200px]">{item.title || item.url}</span>
                    <button
                      onClick={() => setSelectedUrls((prev) => prev.filter((s) => s.url !== item.url))}
                      className="ml-0.5 hover:opacity-70"
                      style={{ color: 'var(--apple-text-muted)' }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Search to add pages */}
            <div ref={searchRef} className="relative mb-3">
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
                  className="absolute backdrop-blur-lg z-10 left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-lg"
                  style={{
                    background: 'var(--apple-bg-panel)',
                    border: '1px solid var(--apple-border)',
                  }}
                >
                  {filteredResults.map((result, i) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSelectedUrls((prev) => [...prev, { url: result.url, title: result.seoTitle, faviconPath: result.faviconPath }])
                        setSearchQuery('')
                        setSearchOpen(false)
                      }}
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="px-4 py-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 apple-primary-green disabled:opacity-50"
              >
                {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => { setShowCreate(false); setName(''); setSelectedUrls([]); setSearchQuery('') }}
                className="px-3 py-2.5 rounded-lg text-[11px] font-semibold apple-secondary-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {collections.length > 0 ? (
          <div className="flex flex-col gap-2">
            {collections.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl apple-panel-soft apple-list-item cursor-pointer"
                onClick={() => navigate(`/collections/${c.id}`)}
              >
                <FolderOpen className="w-4 h-4 shrink-0" style={{ color: 'var(--apple-green)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                    {c.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]" style={{ color: 'var(--apple-text-secondary)' }}>
                      {c.itemCount} URL{c.itemCount !== 1 ? 's' : ''}
                    </span>
                    {c.isPublic && (
                      <>
                        <span className="text-[10px]" style={{ color: 'var(--apple-text-faint)' }}>&middot;</span>
                        <Globe className="w-2.5 h-2.5" style={{ color: 'var(--apple-blue)' }} />
                        <span className="text-[10px] font-medium" style={{ color: 'var(--apple-blue)' }}>
                          Public
                        </span>
                      </>
                    )}
                    <span className="text-[10px]" style={{ color: 'var(--apple-text-faint)' }}>&middot;</span>
                    <span className="text-[10px]" style={{ color: 'var(--apple-text-secondary)' }}>
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {c.isPublic && c.slug && (
                  <a
                    href={`${apiBase}/collections/rss/${c.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold apple-secondary-btn shrink-0"
                  >
                    <Rss className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          !showCreate && (
            <div className="rounded-xl px-5 py-10 text-center apple-panel-soft">
              <Library className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--apple-text-faint)' }} />
              <p className="text-[13px] mb-3" style={{ color: 'var(--apple-text-secondary)' }}>
                No collections yet.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 mx-auto apple-primary-green"
              >
                <Plus className="w-3.5 h-3.5" />
                Create your first collection
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default CollectionsPage
