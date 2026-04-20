import { Identicon } from '@/components/ui/Identicon'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, FileText, FolderOpen, Globe, Loader2, Plus, Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  useAgentCreateDomainJobsLazyQuery,
  useAgentCreateSearchPagesLazyQuery,
  useCollectionsForAgentQuery,
  useCreateAgentSessionMutation,
} from '../../generated/graphql'

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function getHostname(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}

const DEFAULT_SYSTEM_PROMPT = `You are an assistant that helps users analyze and query data from archived web pages. You have access to the full text content and key images from each page. Answer questions based on the actual page content. Be specific and cite the source page URL when relevant.`

interface ProviderInfo {
  id: string
  name: string
  available: boolean
  defaultModel: string
  models: string[]
  error?: string
}

// Source types that can be added to an agent
type SelectedSource =
  | { kind: 'collection'; id: string; name: string; jobIds: string[] }
  | { kind: 'domain'; domain: string; jobIds: string[] }
  | { kind: 'page'; jobId: string; url: string; title: string | null; faviconPath: string | null }

function sourceKey(s: SelectedSource): string {
  switch (s.kind) {
    case 'collection': return `collection:${s.id}`
    case 'domain': return `domain:${s.domain}`
    case 'page': return `page:${s.jobId}`
  }
}

const AgentCreatePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [createSession] = useCreateAgentSessionMutation()

  const [title, setTitle] = useState('')
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [provider, setProvider] = useState('')
  const [model, setModel] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [sources, setSources] = useState<SelectedSource[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Providers
  const [providers, setProviders] = useState<ProviderInfo[]>([])
  useEffect(() => {
    const base =
      import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '').replace('/graphql', '') ||
      'http://localhost:4000'
    fetch(`${base}/agent/status`)
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers ?? [])
        setProvider((prev) => prev || data.provider || 'anthropic')
      })
      .catch(() => null)
  }, [])
  const activeProvider = providers.find((p) => p.id === provider)

  // Collections data
  const { data: collectionsData } = useCollectionsForAgentQuery({
    variables: { userId: user?.id ?? '' },
    skip: !user?.id,
  })
  const collections = useMemo(() => collectionsData?.myCollections ?? [], [collectionsData])

  // Page search (lazy, triggered by query)
  const [searchPages, { data: pagesData, loading: pagesLoading }] = useAgentCreateSearchPagesLazyQuery()
  const [fetchDomainJobs] = useAgentCreateDomainJobsLazyQuery()

  // Debounced search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    if (searchQuery.trim().length < 2) return
    searchTimerRef.current = setTimeout(() => {
      searchPages({ variables: { query: searchQuery.trim(), pagination: { take: 20 } } })
    }, 250)
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current) }
  }, [searchQuery, searchPages])

  // Pre-select from URL params
  const preselectedCollectionId = searchParams.get('collectionId')
  const preselectedDomain = searchParams.get('domain')

  useEffect(() => {
    if (!preselectedCollectionId || collections.length === 0) return
    const match = collections.find((c) => c.id === preselectedCollectionId)
    if (!match) return
    setSources((prev) => {
      if (prev.some((s) => s.kind === 'collection' && s.id === match.id)) return prev
      return [...prev, {
        kind: 'collection',
        id: match.id,
        name: match.name,
        jobIds: match.items.filter((i) => i.jobId).map((i) => i.jobId!),
      }]
    })
  }, [preselectedCollectionId, collections])

  useEffect(() => {
    if (!preselectedDomain) return
    fetchDomainJobs({ variables: { domain: preselectedDomain, pagination: { take: 500 } } }).then(({ data }) => {
      const jobs = data?.completed ?? []
      if (jobs.length === 0) return
      setSources((prev) => {
        if (prev.some((s) => s.kind === 'domain' && s.domain === preselectedDomain)) return prev
        return [...prev, {
          kind: 'domain',
          domain: preselectedDomain,
          jobIds: jobs.map((j) => j.id),
        }]
      })
    })
  }, [preselectedDomain, fetchDomainJobs])

  // Outside-click dismissal
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Build dropdown results: collections, domains (derived from pages), individual pages
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedKeys = new Set(sources.map(sourceKey))
  const q = searchQuery.toLowerCase().trim()

  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      if (selectedKeys.has(`collection:${c.id}`)) return false
      if (q.length === 0) return true
      // Search by collection name or by URLs/titles of items inside
      if (c.name.toLowerCase().includes(q)) return true
      return c.items.some((item) =>
        item.url.toLowerCase().includes(q) ||
        (item.title && item.title.toLowerCase().includes(q))
      )
    })
  }, [collections, selectedKeys, q])

  const searchResultPages = useMemo(() => {
    const pages = pagesData?.readerIndex ?? []
    return pages.filter((p) => !selectedKeys.has(`page:${p.id}`))
  }, [pagesData, selectedKeys])

  // Derive unique domains from search results
  const searchResultDomains = useMemo(() => {
    const pages = pagesData?.readerIndex ?? []
    const domainMap = new Map<string, { domain: string; faviconPath: string | null; count: number }>()
    for (const p of pages) {
      const d = getHostname(p.url)
      if (selectedKeys.has(`domain:${d}`)) continue
      const entry = domainMap.get(d)
      if (entry) {
        entry.count++
      } else {
        domainMap.set(d, { domain: d, faviconPath: p.faviconPath ?? null, count: 1 })
      }
    }
    return [...domainMap.values()].filter((d) => d.count > 1)
  }, [pagesData, selectedKeys])

  const hasResults = filteredCollections.length > 0 || searchResultDomains.length > 0 || searchResultPages.length > 0

  // Add source helpers
  const addCollection = useCallback((c: typeof collections[number]) => {
    setSources((prev) => [...prev, {
      kind: 'collection',
      id: c.id,
      name: c.name,
      jobIds: c.items.filter((i) => i.jobId).map((i) => i.jobId!),
    }])
    setSearchQuery('')
    setDropdownOpen(false)
  }, [])

  const addDomain = useCallback((domain: string) => {
    setDropdownOpen(false)
    setSearchQuery('')
    fetchDomainJobs({ variables: { domain, pagination: { take: 500 } } }).then(({ data }) => {
      const jobs = data?.completed ?? []
      setSources((prev) => [...prev, { kind: 'domain', domain, jobIds: jobs.map((j) => j.id) }])
    })
  }, [fetchDomainJobs])

  const addPage = useCallback((p: { id: string; url: string; seoTitle?: string | null; faviconPath?: string | null }) => {
    setSources((prev) => [...prev, {
      kind: 'page',
      jobId: p.id,
      url: p.url,
      title: p.seoTitle ?? null,
      faviconPath: p.faviconPath ?? null,
    }])
    setSearchQuery('')
    setDropdownOpen(false)
  }, [])

  const removeSource = useCallback((key: string) => {
    setSources((prev) => prev.filter((s) => sourceKey(s) !== key))
  }, [])

  // Prompt hash
  const [promptHash, setPromptHash] = useState<string | null>(null)
  useEffect(() => {
    if (!systemPrompt.trim()) { setPromptHash(null); return }
    sha256Hex(systemPrompt).then(setPromptHash)
  }, [systemPrompt])

  const handleCreate = useCallback(async () => {
    if (!user?.id || !user?.walletAddress) return
    setCreateError(null)
    setCreating(true)
    try {
      const jobIds: string[] = []
      for (const s of sources) {
        switch (s.kind) {
          case 'collection':
          case 'domain':
            jobIds.push(...s.jobIds)
            break
          case 'page':
            jobIds.push(s.jobId)
            break
        }
      }

      const uniqueJobIds = [...new Set(jobIds)]
      if (uniqueJobIds.length === 0) {
        setCreateError('Add at least one source with processed pages before creating an agent.')
        setCreating(false)
        return
      }

      let resolvedModel = model.trim() || activeProvider?.defaultModel || undefined
      if (provider === 'local' && resolvedModel && !resolvedModel.startsWith('local:')) {
        resolvedModel = `local:${resolvedModel}`
      }

      const { data } = await createSession({
        variables: {
          userId: user.id,
          walletAddress: user.walletAddress,
          jobIds: uniqueJobIds,
          title: title.trim() || undefined,
          systemPrompt: systemPrompt.trim() || undefined,
          model: resolvedModel,
        },
      })
      if (data?.createAgentSession?.id) {
        navigate(`/agent/${data.createAgentSession.id}`)
      }
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create agent')
    } finally {
      setCreating(false)
    }
  }, [user, title, systemPrompt, provider, model, sources, activeProvider, createSession, navigate])

  const inputStyle = {
    background: 'var(--apple-bg-input)',
    color: 'var(--apple-text-primary)',
    border: '1px solid var(--apple-border)',
  }

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-16">
        <button
          onClick={() => navigate('/agent')}
          className="flex items-center gap-1.5 text-[12px] font-medium mb-6"
          style={{ color: 'var(--apple-text-secondary)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Agent
        </button>

        <div className="flex items-center gap-4 mb-6">
          <Identicon hash={promptHash} size={48} className="rounded-xl shrink-0" />
          <div>
            <h1 className="text-[22px] font-bold" style={{ color: 'var(--apple-text-primary)' }}>
              Create Agent
            </h1>
            {promptHash && (
              <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--apple-text-muted)' }}>
                {promptHash.slice(0, 16)}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl p-5 mb-4 apple-panel">
          {/* Name */}
          <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--apple-text-muted)' }}>
            Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Research Agent"
            className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium outline-none mb-4"
            style={inputStyle}
            autoFocus
          />

          {/* Provider */}
          <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--apple-text-muted)' }}>
            Provider
          </label>
          <select
            value={provider}
            onChange={(e) => { setProvider(e.target.value); setModel('') }}
            className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium outline-none mb-1"
            style={inputStyle}
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}{!p.available ? ' (offline)' : ''}
              </option>
            ))}
          </select>
          {activeProvider && (
            <p className="text-[10px] mb-3" style={{ color: activeProvider.available ? 'var(--apple-green)' : '#ff453a' }}>
              {activeProvider.available ? 'Connected' : activeProvider.error || 'Offline'}
            </p>
          )}

          {/* Model */}
          <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--apple-text-muted)' }}>
            Model
          </label>
          {activeProvider && activeProvider.models.length > 0 ? (
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium outline-none mb-4"
              style={inputStyle}
            >
              <option value="">Default ({activeProvider.defaultModel})</option>
              {activeProvider.models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={activeProvider?.defaultModel || 'model name'}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium outline-none mb-4"
              style={inputStyle}
            />
          )}

          {/* Sources */}
          <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--apple-text-muted)' }}>
            Sources
          </label>
          {sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {sources.map((s) => {
                const key = sourceKey(s)
                let icon: React.ReactNode
                let label: string
                switch (s.kind) {
                  case 'collection':
                    icon = <FolderOpen className="w-3 h-3 shrink-0" style={{ color: 'var(--apple-green)' }} />
                    label = s.name
                    break
                  case 'domain':
                    icon = <Globe className="w-3 h-3 shrink-0" style={{ color: '#0a84ff' }} />
                    label = s.domain
                    break
                  case 'page':
                    icon = <FileText className="w-3 h-3 shrink-0" style={{ color: 'var(--apple-text-secondary)' }} />
                    label = s.title || getHostname(s.url)
                    break
                }
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium"
                    style={inputStyle}
                  >
                    {icon}
                    <span className="truncate max-w-[200px]">{label}</span>
                    <button
                      onClick={() => removeSource(key)}
                      className="ml-0.5 hover:opacity-70"
                      style={{ color: 'var(--apple-text-muted)' }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}
          <div ref={dropdownRef} className="relative mb-4">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={inputStyle}>
              <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--apple-text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setDropdownOpen(true)
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Search collections, domains, or pages..."
                className="flex-1 text-[13px] font-medium outline-none bg-transparent"
                style={{ color: 'var(--apple-text-primary)' }}
              />
              {pagesLoading && <Loader2 className="w-3 h-3 animate-spin shrink-0" style={{ color: 'var(--apple-text-muted)' }} />}
            </div>
            {dropdownOpen && hasResults && (
              <div
                className="absolute backdrop-blur-lg z-10 left-0 right-0 mt-1 rounded-xl overflow-y-auto shadow-lg"
                style={{
                  background: 'var(--apple-bg-panel)',
                  border: '1px solid var(--apple-border)',
                  maxHeight: 'min(360px, 50vh)',
                }}
              >
                {/* Collections section */}
                {filteredCollections.length > 0 && (
                  <>
                    <div className="px-4 pt-2.5 pb-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--apple-text-muted)' }}>
                        Collections
                      </p>
                    </div>
                    {filteredCollections.map((c) => {
                      const pageCount = c.items.filter((item) => item.jobId).length
                      return (
                        <button
                          key={`col-${c.id}`}
                          onClick={() => addCollection(c)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <FolderOpen className="w-4 h-4 shrink-0" style={{ color: 'var(--apple-green)' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                              {c.name}
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--apple-text-muted)' }}>
                              {pageCount} page{pageCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </>
                )}

                {/* Domains section */}
                {searchResultDomains.length > 0 && (
                  <>
                    <div className="px-4 pt-2.5 pb-1" style={filteredCollections.length > 0 ? { borderTop: '1px solid var(--apple-border)' } : undefined}>
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--apple-text-muted)' }}>
                        Domains
                      </p>
                    </div>
                    {searchResultDomains.map((d) => (
                      <button
                        key={`dom-${d.domain}`}
                        onClick={() => addDomain(d.domain)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <Globe className="w-4 h-4 shrink-0" style={{ color: '#0a84ff' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                            {d.domain}
                          </p>
                          <p className="text-[10px]" style={{ color: 'var(--apple-text-muted)' }}>
                            {d.count} page{d.count !== 1 ? 's' : ''} matching
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {/* Pages section */}
                {searchResultPages.length > 0 && (
                  <>
                    <div
                      className="px-4 pt-2.5 pb-1"
                      style={(filteredCollections.length > 0 || searchResultDomains.length > 0) ? { borderTop: '1px solid var(--apple-border)' } : undefined}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--apple-text-muted)' }}>
                        Pages
                      </p>
                    </div>
                    {searchResultPages.map((p) => (
                      <button
                        key={`page-${p.id}`}
                        onClick={() => addPage(p)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        {p.faviconPath ? (
                          <img src={p.faviconPath} alt="" className="w-4 h-4 rounded-sm shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 shrink-0" style={{ color: 'var(--apple-text-muted)' }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                            {p.seoTitle || p.url}
                          </p>
                          <p className="text-[10px] truncate" style={{ color: 'var(--apple-text-muted)' }}>
                            {getHostname(p.url)}{new URL(p.url).pathname !== '/' ? new URL(p.url).pathname : ''}
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* System Prompt */}
          <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--apple-text-muted)' }}>
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium outline-none resize-y"
            style={{
              ...inputStyle,
              fontFamily: '"JetBrains Mono", "SF Mono", monospace',
              fontSize: 12,
              lineHeight: 1.6,
            }}
          />

          {createError && (
            <p className="text-[11px] font-medium mt-3" style={{ color: '#ff453a' }}>
              {createError}
            </p>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="px-5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-2 apple-primary-green disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {creating ? 'Creating...' : 'Create Agent'}
        </button>
      </div>
    </div>
  )
}

export default AgentCreatePage
