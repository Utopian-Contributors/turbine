import { useAuth } from '@/contexts/AuthContext'
import { filesize } from 'filesize'
import { ArrowLeft, ExternalLink, Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import {
  OptimizationMode,
  useArchiveViewMutation,
  useKeywordPromotionQuery,
  useReaderIndexCountQuery,
  useReaderIndexQuery,
  useSearchImagesCountQuery,
  useSearchImagesQuery,
} from '../../generated/graphql'

const BACKEND_URL =
  import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '').replace(
    '/graphql',
    '',
  ) || 'http://localhost:4000'

/** Resolve a reader path (possibly relative like "data/id/reader-simple.html") to an absolute URL. */
function toAbsoluteReaderUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}/${path.replace(/^\//, '')}`
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function getPathname(url: string): string {
  try {
    const p = new URL(url).pathname
    return p === '/' ? '' : p
  } catch {
    return ''
  }
}

function getJobSummary(job: {
  optimizedFiles?:
    | {
        isBestVariant?: boolean | null
        originalUrl?: string | null
        id: string
        originalSize?: string | number | null
        optimizedSize?: string | number | null
      }[]
    | null
}) {
  const seen = new Set<string>()
  let original = 0
  let optimized = 0
  let fileCount = 0

  for (const file of job.optimizedFiles ?? []) {
    if (!file.isBestVariant) continue
    const key = file.originalUrl ?? file.id
    if (seen.has(key)) continue
    seen.add(key)
    original += Number(file.originalSize)
    optimized += Number(file.optimizedSize)
    fileCount++
  }

  const saved = Math.max(0, original - optimized)
  const pct = original > 0 ? (saved / original) * 100 : 0
  return { fileCount, original, optimized, saved, pct }
}

interface ReaderTab {
  id: string
  url?: string
  title: string
  host: string
  favicon: string | null
  simpleReaderUrl: string | null
  ultraReaderUrl: string | null
  mode: 'SIMPLE' | 'ULTRA'
}

const BrowserPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [archiveView] = useArchiveViewMutation()
  const { jobId: urlJobId, mode: urlMode } = useParams<{
    jobId?: string
    mode?: string
  }>()

  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') ?? '')
  const [mode, setMode] = useState<'SIMPLE' | 'ULTRA'>((searchParams.get('mode')?.toUpperCase() === 'SIMPLE' ? 'SIMPLE' : 'ULTRA'))
  const [category, setCategory] = useState<'web' | 'images'>((searchParams.get('category') === 'images' ? 'images' : 'web'))

  // Tabs state — restore saved tabs from localStorage on mount.
  const [tabs, setTabs] = useState<ReaderTab[]>(() => {
    try {
      const saved = localStorage.getItem('browser-tabs')
      if (saved) return (JSON.parse(saved) as ReaderTab[]).slice(0, 5)
    } catch {
      /* */
    }
    return []
  })

  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    if (urlJobId) return urlJobId
    try {
      return localStorage.getItem('browser-active-tab') || null
    } catch {
      return null
    }
  })
  const [tabMode, setTabMode] = useState<'SIMPLE' | 'ULTRA'>(
    urlMode === 'simple' ? 'SIMPLE' : 'ULTRA',
  )

  // Persist active tab to localStorage
  useEffect(() => {
    try {
      if (activeTabId) localStorage.setItem('browser-active-tab', activeTabId)
      else localStorage.removeItem('browser-active-tab')
    } catch {
      /* */
    }
  }, [activeTabId])

  // Persist tabs to localStorage (max 5)
  useEffect(() => {
    try {
      localStorage.setItem('browser-tabs', JSON.stringify(tabs.slice(0, 5)))
    } catch {
      /* */
    }
  }, [tabs])

  useEffect(() => {
    document.title = 'Tumbler | Browser'
  }, [])

  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get('page') ?? '', 10)
    return Number.isFinite(p) && p > 0 ? p : 0
  })
  const PAGE_SIZE = 30

  const prevSearchRef = useRef(search)
  const prevCategoryRef = useRef(category)

  useEffect(() => {
    const searchChanged = search !== prevSearchRef.current
    prevSearchRef.current = search
    if (!searchChanged) return
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  // Reset page when category changes
  useEffect(() => {
    const changed = category !== prevCategoryRef.current
    prevCategoryRef.current = category
    if (changed) setPage(0)
  }, [category])

  // Sync search/mode/category/page to URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (mode !== 'ULTRA') params.set('mode', mode.toLowerCase())
    if (category !== 'web') params.set('category', category)
    if (page > 0) params.set('page', String(page))
    setSearchParams(params, { replace: true })
  }, [search, mode, category, page, setSearchParams])

  const { data } = useReaderIndexQuery({
    variables: {
      query: debouncedSearch || undefined,
      pagination: { take: PAGE_SIZE, skip: page * PAGE_SIZE },
      mode: mode as OptimizationMode,
    } as never,
    pollInterval: 60000,
    skip: category !== 'web',
  })

  const { data: countData } = useReaderIndexCountQuery({
    variables: {
      query: debouncedSearch || undefined,
      mode: mode as OptimizationMode,
    } as never,
    skip: category !== 'web',
  })

  const { data: imageData } = useSearchImagesQuery({
    variables: {
      query: debouncedSearch || undefined,
      family: mode.toLowerCase(),
      pagination: { take: PAGE_SIZE, skip: page * PAGE_SIZE },
    },
    skip: category !== 'images',
  })

  const { data: imageCountData } = useSearchImagesCountQuery({
    variables: {
      query: debouncedSearch || undefined,
      family: mode.toLowerCase(),
    },
    skip: category !== 'images',
  })

  // Keyword promotion: fetch the winning bid for the current search term
  const { data: promoData } = useKeywordPromotionQuery({
    variables: { query: debouncedSearch || '' },
    skip: !debouncedSearch || debouncedSearch.length < 2 || category !== 'web',
  })
  const promotion = promoData?.keywordPromotion ?? null

  const results = useMemo(() => {
    const mapped = (data?.readerIndex ?? []).map((job) => {
      const j = job as unknown as Record<string, unknown>
      const host = getHostname(job.url)
      const path = getPathname(job.url)
      const originalBytes = Number(job.originalPageSize ?? 0)
      const summary = getJobSummary(job)
      const savedPct =
        summary.original > 0 ? Math.max(0, Math.round(summary.pct)) : null
      const simpleReaderUrl = toAbsoluteReaderUrl(
        (j.simpleReaderPath || null) as string | null,
      )
      const ultraReaderUrl = toAbsoluteReaderUrl(
        (j.ultraReaderPath || null) as string | null,
      )
      const previewImage = (j.compressedPreviewImage as string) || null
      // Backend filters by mode, so the matching reader URL is always the primary one.
      // Keep effectiveReaderUrl as the same value for tab-open compatibility.
      const readerUrl = simpleReaderUrl || ultraReaderUrl
      const effectiveReaderUrl = readerUrl
      return {
        id: job.id,
        url: job.url,
        host,
        path,
        title: (j.seoTitle as string) || path || host,
        description: (j.seoDescription as string) || null,
        previewImage,
        readerUrl,
        effectiveReaderUrl,
        simpleReaderUrl,
        ultraReaderUrl,
        originalBytes,
        savedPct,
        contentHash: (j.contentHashSum as string) || null,
        favicon: (j.faviconPath as string) || null,
        phoneNumber: (j.phoneNumber as string) || null,
        date: job.createdAt,
      }
    })
    return mapped
  }, [data?.readerIndex])

  const totalPages = countData?.readerIndexCount ?? results.length

  // Sync from URL params — only when URL explicitly specifies a job
  useEffect(() => {
    if (!urlJobId) return

    const match = results.find((r) => r.id === urlJobId)
    setTabs((prev) => {
      const existing = prev.find((t) => t.id === urlJobId)
      const modeFromUrl = urlMode === 'simple' ? 'SIMPLE' : 'ULTRA'
      if (existing) {
        // Update mode, enrich title/favicon/URLs from results if available
        const needsMode = existing.mode !== modeFromUrl
        const needsEnrich =
          match &&
          (existing.title === existing.id ||
            !existing.favicon ||
            match.simpleReaderUrl !== existing.simpleReaderUrl ||
            match.ultraReaderUrl !== existing.ultraReaderUrl)
        if (needsMode || needsEnrich) {
          return prev.map((t) =>
            t.id === urlJobId
              ? {
                  ...t,
                  mode: modeFromUrl,
                  ...(needsEnrich && match
                    ? {
                        title: match.title || t.title,
                        host: match.host || t.host,
                        favicon: match.favicon || t.favicon,

                        simpleReaderUrl:
                          match.simpleReaderUrl !== undefined
                            ? match.simpleReaderUrl
                            : t.simpleReaderUrl,
                        ultraReaderUrl:
                          match.ultraReaderUrl !== undefined
                            ? match.ultraReaderUrl
                            : t.ultraReaderUrl,
                      }
                    : {}),
                }
              : t,
          )
        }
        return prev
      }
      const newTab: ReaderTab = {
        id: urlJobId,
        url: match?.url,
        title: match?.title || urlJobId,
        host: match?.host || urlJobId,
        favicon: match?.favicon || null,
        // Use actual server URLs when available; fall back to constructed URLs so the
        // iframe can load immediately without waiting for results to arrive.
        // Use explicit null check (not ??) so a null from the server (reader doesn't exist)
        // is preserved rather than replaced with the fallback.
        simpleReaderUrl: match
          ? match.simpleReaderUrl
          : `${BACKEND_URL}/data/${urlJobId}/reader-simple.html`,
        ultraReaderUrl: match
          ? match.ultraReaderUrl
          : `${BACKEND_URL}/data/${urlJobId}/reader-ultra.html`,
        mode: (urlMode === 'simple' ? 'SIMPLE' : 'ULTRA') as 'SIMPLE' | 'ULTRA',
      }
      // Remove any stale tab for the same URL (different job ID) — happens when a URL
      // has been archived multiple times and the user opens a newer version.
      // Also match tabs without a stored URL by looking them up in results.
      let filtered = prev
      if (match?.url) {
        filtered = prev.filter((t) => {
          if (t.id === urlJobId) return true
          if (t.url === match.url) return false
          // Tabs restored from localStorage have no stored url; look up via raw query data
          if (!t.url) {
            const tabResult = (data?.readerIndex ?? []).find(
              (j) => j.id === t.id,
            )
            if (tabResult?.url === match.url) return false
          }
          return true
        })
      }
      const next = [...filtered, newTab]
      if (next.length > 5) next.shift()
      return next
    })
    setActiveTabId(urlJobId)
    if (urlMode === 'simple') setTabMode('SIMPLE')
    else setTabMode('ULTRA')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlJobId, urlMode])

  // Enrich all tabs with favicon/title/reader URLs from results whenever data arrives
  useEffect(() => {
    if (results.length === 0) return
    setTabs((prev) => {
      let changed = false
      const next = prev.map((t) => {
        const match = results.find((r) => r.id === t.id)
        if (!match) return t
        const needsDisplay = !t.favicon || t.title === t.id
        const needsUrls =
          match.simpleReaderUrl !== t.simpleReaderUrl ||
          match.ultraReaderUrl !== t.ultraReaderUrl
        if (needsDisplay || needsUrls) {
          changed = true
          return {
            ...t,
            title: needsDisplay ? match.title || t.title : t.title,
            host: needsDisplay ? match.host || t.host : t.host,
            favicon: needsDisplay ? match.favicon || t.favicon : t.favicon,
            // Use null from match explicitly — if server says the reader doesn't exist,
            // null out the URL so the mode button is disabled rather than loading a 404.
            simpleReaderUrl:
              match.simpleReaderUrl !== undefined
                ? match.simpleReaderUrl
                : t.simpleReaderUrl,
            ultraReaderUrl:
              match.ultraReaderUrl !== undefined
                ? match.ultraReaderUrl
                : t.ultraReaderUrl,
          }
        }
        return t
      })
      return changed ? next : prev
    })
  }, [results])

  // Actually open a tab (after payment confirmed or already archived)
  const doOpenTab = useCallback(
    (result: (typeof results)[number]) => {
      // Log to browsing history
      try {
        const history = JSON.parse(
          localStorage.getItem('browser-history') || '[]',
        ) as Array<{
          id: string
          title: string
          host: string
          url: string
          timestamp: number
        }>
        history.unshift({
          id: result.id,
          title: result.title,
          host: result.host,
          url: result.url,
          timestamp: Date.now(),
        })
        localStorage.setItem(
          'browser-history',
          JSON.stringify(history.slice(0, 100)),
        )
      } catch {
        /* */
      }

      // Auto-archive when opening a reader view
      if (user?.id) {
        archiveView({
          variables: { userId: user.id, jobId: result.id },
        }).catch(() => {})
      }

      const m = mode === 'ULTRA' ? 'ultra' : 'simple'
      navigate(`/browser/${result.id}/${m}`)
    },
    [mode, navigate, user, archiveView],
  )

  // Open tab directly — pages that already exist are free to view.
  // Uses effectiveReaderUrl (with fallback) so any result with any reader can open.
  const openTab = useCallback(
    (result: (typeof results)[number]) => {
      if (!result.effectiveReaderUrl) return
      doOpenTab(result)
    },
    [doOpenTab],
  )

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== tabId)
        if (activeTabId === tabId) {
          if (next.length > 0) {
            const last = next[next.length - 1]
            navigate(
              `/browser/${last.id}/${tabMode === 'ULTRA' ? 'ultra' : 'simple'}`,
            )
          } else {
            navigate('/browser')
          }
        }
        return next
      })
    },
    [activeTabId, tabMode, navigate],
  )

  const backToSearch = useCallback(() => {
    navigate('/browser')
  }, [navigate])

  const switchToTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId)
      navigate(
        `/browser/${tabId}/${tab?.mode === 'SIMPLE' ? 'simple' : 'ultra'}`,
      )
    },
    [tabs, navigate],
  )

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const activeTabIdRef = useRef(activeTabId)
  const searchScrollRef = useRef<HTMLDivElement>(null)

  // Restore scroll position on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('browser-search-scroll')
    if (saved && searchScrollRef.current) {
      searchScrollRef.current.scrollTop = Number(saved)
    }
  }, [])
  useEffect(() => {
    activeTabIdRef.current = activeTabId
  }, [activeTabId])

  // Listen for postMessage from reader iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data) return

      if (e.data.type !== 'reader-loaded') return

      // Only process messages from the active iframe — ignore hidden background tabs
      if (iframeRef.current && e.source !== iframeRef.current.contentWindow)
        return

      const {
        url,
        title: pageTitle,
        baseHref,
      } = e.data as { url: string; title: string; baseHref: string }

      const match = url.match(/\/data\/([^/]+)\/reader-(simple|ultra)\.html/)
      if (!match) return
      const [, newJobId, newMode] = match

      let pageHost = newJobId
      try {
        pageHost = new URL(baseHref).hostname
      } catch {
        /* */
      }

      const currentTab = activeTabIdRef.current

      // Update tab title/host
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === newJobId || t.id === currentTab) {
            if (t.title === t.id || t.host === t.id) {
              return { ...t, title: pageTitle || pageHost, host: pageHost }
            }
          }
          return t
        }),
      )

      // Ignore messages when on search view or from the current tab
      if (!currentTab || newJobId === currentTab) return

      // Navigated to a different reader page within the active iframe
      const dataBase = url.replace(/\/reader-(simple|ultra)\.html.*/, '')
      setTabs((prev) => {
        if (
          prev.find(
            (t) => t.id === newJobId || (baseHref && t.url === baseHref),
          )
        )
          return prev
        const next = [
          ...prev,
          {
            id: newJobId,
            url: baseHref || undefined,
            title: pageTitle || pageHost,
            host: pageHost,
            favicon: null,
            simpleReaderUrl: dataBase + '/reader-simple.html',
            ultraReaderUrl: dataBase + '/reader-ultra.html',
            mode:
              newMode === 'ultra' ? ('ULTRA' as const) : ('SIMPLE' as const),
          },
        ]
        if (next.length > 5) next.shift()
        return next
      })
      setTabMode(newMode === 'ultra' ? 'ULTRA' : 'SIMPLE')
      navigate(`/browser/${newJobId}/${newMode}`, { replace: true })
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [activeTabId, navigate])

  // Active reader view — driven by URL, not activeTabId, so navigating back to /browser
  // hides the reader without clearing the last-active tab from the tab bar.
  const showingReader = !!urlJobId
  const activeTab = tabs.find((t) => t.id === activeTabId)

  const hasSimple = activeTab?.simpleReaderUrl != null
  const hasUltra = activeTab?.ultraReaderUrl != null
  const canToggleMode = hasSimple || hasUltra

  // Mode toggle: update the tab's mode and navigate the iframe
  const handleModeToggle = useCallback(
    (m: 'SIMPLE' | 'ULTRA') => {
      if (!activeTabId) return
      setTabMode(m)
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, mode: m } : t)),
      )
      const newUrl =
        m === 'ULTRA' ? activeTab?.ultraReaderUrl : activeTab?.simpleReaderUrl
      if (newUrl && iframeRef.current) {
        iframeRef.current.src = newUrl
      }
      navigate(`/browser/${activeTabId}/${m.toLowerCase()}`, { replace: true })
    },
    [activeTab, activeTabId, navigate],
  )

  return (
    <div className="w-full min-h-screen flex flex-col apple-page">
      {/* Tab bar — always visible when tabs exist */}
      <div
        className="flex items-center gap-0 px-2 pt-2 shrink-0 overflow-x-auto"
        style={{
          background: 'var(--apple-bg-surface)',
          borderBottom: '1px solid var(--apple-border)',
        }}
      >
        {/* Search input tab */}
        <div
          className="flex bg-transparent border border-0.5 border-b-black border-[#ddd8ce] items-center gap-1.5 px-2 py-2 rounded-t-lg shrink-0 transition-colors"
          style={
            showingReader
              ? {
                  background: 'var(--bg-background)',
                  borderColor: 'transparent',
                }
              : undefined
          }
        >
          <Search
            className="w-3 h-3 shrink-0"
            style={{ color: 'var(--apple-text-secondary)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              backToSearch()
            }}
            onFocus={backToSearch}
            placeholder="Search"
            className="bg-transparent text-[11px] font-medium outline-none w-24 focus:w-40 transition-all"
            style={{ color: 'var(--apple-text-primary)' }}
          />
        </div>

        {/* Reader tabs */}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="w-50 flex apple-page border-transparent items-center gap-1 px-3 py-2 rounded-t-lg cursor-pointer transition-colors group min-w-[120px] max-w-[200px]"
            style={
              showingReader && activeTabId === tab.id
                ? {
                    border: 'solid 0.5px #ddd8ce',
                    borderBottomColor: 'black',
                    color: 'var(--apple-text-primary)',
                  }
                : {
                    border: 'solid 0.5px transparent',
                    background: 'transparent',
                    color: 'var(--apple-text-secondary)',
                  }
            }
            onClick={() => switchToTab(tab.id)}
          >
            {tab.favicon && (
              <img
                src={tab.favicon}
                alt=""
                className="w-3 h-3 rounded-sm shrink-0"
              />
            )}
            <span className="text-[11px] font-medium truncate flex-1">
              {tab.title !== tab.id ? tab.title : tab.host}
            </span>
            <button
              className="ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
            >
              <X
                className="w-3 h-3"
                style={{ color: 'var(--apple-text-secondary)' }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Search view */}
      <div
        ref={searchScrollRef}
        className="flex-1 overflow-y-auto"
        style={{ display: showingReader ? 'none' : undefined }}
        onScroll={(e) => {
          sessionStorage.setItem('browser-search-scroll', String((e.target as HTMLDivElement).scrollTop))
        }}
      >
        <div className="max-w-4xl mx-auto px-5 pt-8 pb-16 flex gap-8">
          <div className="flex-1 mx-auto min-w-0 max-w-4xl">
            {/* Search bar */}
            <div className="flex items-center gap-3 mb-1">
              <div
                className="flex-1 flex items-center gap-2 border-b-2 pb-2"
                style={{ borderColor: 'var(--apple-text-primary)' }}
              >
                <Search
                  className="w-4 h-4 shrink-0"
                  style={{ color: 'var(--apple-text-primary)' }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="search"
                  className="flex-1 bg-transparent text-[14px] font-medium outline-none"
                  style={{
                    color: 'var(--apple-text-primary)',
                    fontFamily: 'system-ui',
                  }}
                />
              </div>
              <div className="flex gap-0.5 shrink-0">
                <button
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors"
                  style={
                    mode === 'SIMPLE'
                      ? { background: '#0071e3', color: '#fff' }
                      : {
                          background: 'transparent',
                          color: 'var(--apple-text-secondary)',
                        }
                  }
                  onClick={() => setMode('SIMPLE')}
                >
                  Simple
                </button>
                <button
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors"
                  style={
                    mode === 'ULTRA'
                      ? {
                          background: 'var(--apple-text-primary)',
                          color: 'var(--apple-bg-surface)',
                        }
                      : {
                          background: 'transparent',
                          color: 'var(--apple-text-secondary)',
                        }
                  }
                  onClick={() => setMode('ULTRA')}
                >
                  Ultra
                </button>
              </div>
            </div>

            {/* Category pills + visibility toggle */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex gap-1.5">
                {(['web', 'images'] as const).map((c) => (
                  <button
                    key={c}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full transition-colors capitalize"
                    style={
                      category === c
                        ? {
                            background: 'var(--apple-text-primary)',
                            color: 'var(--apple-bg-surface)',
                          }
                        : {
                            background: 'var(--apple-bg-inactive)',
                            color: 'var(--apple-text-secondary)',
                          }
                    }
                    onClick={() => setCategory(c)}
                  >
                    {c === 'web' ? 'Web' : 'Images'}
                  </button>
                ))}
              </div>
            </div>

            {/* Image results */}
            {category === 'images' && (() => {
              const images = imageData?.searchImages ?? []
              const totalImages = imageCountData?.searchImagesCount ?? images.length
              return (
                <>
                  <p className="text-[11px] mb-6" style={{ color: 'var(--apple-text-secondary)' }}>
                    {totalImages} image{totalImages !== 1 ? 's' : ''}
                    {debouncedSearch ? ` for "${debouncedSearch}"` : ''}
                    {totalImages > PAGE_SIZE && ` — showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, totalImages)}`}
                  </p>
                  {images.length > 0 ? (
                    <div className="columns-2 sm:columns-3 gap-3 [column-fill:_balance]">
                      {images.map((img) => {
                        const src = img.hostedUrl ?? img.storagePath ?? ''
                        const resolvedSrc = src.startsWith('http') ? src : `${BACKEND_URL}/${src.replace(/^\/+/, '')}`
                        const domain = (() => { try { return new URL(img.job.url).hostname.replace(/^www\./, '') } catch { return '' } })()
                        const title = img.job.seoTitle || img.aiDescription || domain
                        return (
                          <a
                            key={img.id}
                            href={resolvedSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mb-3 break-inside-avoid rounded-lg overflow-hidden"
                            style={{ background: 'var(--apple-bg-inactive)' }}
                          >
                            <img
                              src={resolvedSrc}
                              alt={img.aiDescription ?? ''}
                              className="w-full"
                              style={img.width && img.height ? { aspectRatio: `${img.width} / ${img.height}` } : undefined}
                              loading="lazy"
                            />
                            <div className="px-2.5 py-2">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                {img.job.faviconPath && (
                                  <img src={img.job.faviconPath} alt="" className="w-3 h-3 rounded-sm shrink-0" />
                                )}
                                <p className="text-[10px] font-medium truncate" style={{ color: 'var(--apple-text-muted)' }}>
                                  {domain}
                                </p>
                              </div>
                              <p
                                className="text-[11px] font-medium leading-snug"
                                style={{
                                  color: 'var(--apple-text-primary)',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {title}
                              </p>
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[13px] py-12" style={{ color: 'var(--apple-text-secondary)' }}>
                      {debouncedSearch ? 'No images found.' : 'No analyzed images yet.'}
                    </p>
                  )}

                  {/* Image pagination */}
                  {totalImages > PAGE_SIZE && (
                    <div className="flex items-center justify-center gap-4 py-6">
                      <button
                        type="button"
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                        className="text-[12px] px-3 py-1.5 rounded-md disabled:opacity-30"
                        style={{ color: 'var(--apple-blue)' }}
                      >
                        Previous
                      </button>
                      <span
                        className="text-[11px]"
                        style={{ color: 'var(--apple-text-secondary)' }}
                      >
                        Page {page + 1} of {Math.ceil(totalImages / PAGE_SIZE)}
                      </span>
                      <button
                        type="button"
                        disabled={(page + 1) * PAGE_SIZE >= totalImages}
                        onClick={() => setPage((p) => p + 1)}
                        className="text-[12px] px-3 py-1.5 rounded-md disabled:opacity-30"
                        style={{ color: 'var(--apple-blue)' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )
            })()}

            {/* Web results */}
            {category === 'web' && (
              <>

            {/* Keyword promotion — single promoted slot */}
            {promotion && promotion.keyword?.job && (
              <div
                className="mb-6 rounded-xl overflow-hidden apple-panel cursor-pointer transition-all active:scale-[0.99]"
                style={{ border: '1px solid rgba(255,159,10,0.3)' }}
                onClick={() => navigate(`/keywords/${promotion.keyword!.job!.id}`)}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  {promotion.keyword.job.compressedPreviewImage && (
                    <img
                      src={promotion.keyword.job.compressedPreviewImage}
                      alt=""
                      className="w-16 h-12 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: '#ff9f0a', color: '#fff' }}
                      >
                        #{promotion.keyword.keyword}
                      </span>
                      <span
                        className="text-[9px] font-bold"
                        style={{ color: 'var(--apple-text-muted)' }}
                      >
                        {promotion.amount} $UTCC
                      </span>
                    </div>
                    <p
                      className="text-[13px] font-medium truncate"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      {promotion.keyword.job.seoTitle || promotion.keyword.job.url}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {promotion.keyword.job.faviconPath && (
                        <img src={promotion.keyword.job.faviconPath} alt="" className="w-3 h-3 rounded-sm" />
                      )}
                      <span
                        className="text-[10px] truncate"
                        style={{ color: 'var(--apple-text-muted)' }}
                      >
                        {(() => { try { return new URL(promotion.keyword.job.url).hostname } catch { return promotion.keyword.job.url } })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p
              className="text-[11px] mb-6"
              style={{ color: 'var(--apple-text-secondary)' }}
            >
              {totalPages} result{totalPages !== 1 ? 's' : ''}
              {debouncedSearch ? ` for "${debouncedSearch}"` : ''}
              {totalPages > PAGE_SIZE && ` — showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, totalPages)}`}
            </p>

            {results.length > 0 ? (
              <div className="flex flex-col gap-0">
                {results.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="block py-3 border-b text-left w-full"
                    style={{
                      borderColor: 'var(--apple-border)',
                      textDecoration: 'none',
                      opacity: r.readerUrl
                        ? 1
                        : r.effectiveReaderUrl
                          ? 0.6
                          : 0.3,
                      background: 'none',
                    }}
                    onClick={() => openTab(r)}
                    disabled={!r.effectiveReaderUrl}
                  >
                    <div className="flex items-start gap-3">
                      {/* Image thumbnail with gradient placeholder */}
                      <div className="w-56 h-32 shrink-0 rounded-lg apple-page shadow-sm overflow-hidden">
                        <img
                          src={r.previewImage || '/utopian-icon.webp'}
                          alt={r.title}
                          className="p-0.5 rounded-lg w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {r.favicon && (
                            <img
                              src={r.favicon}
                              alt=""
                              className="w-3.5 h-3.5 rounded-sm shrink-0"
                            />
                          )}
                          <p className="text-[11px] font-mono truncate">
                            {r.host}
                            {r.path}
                          </p>
                        </div>
                        <p
                          className="text-[15px] font-medium mt-0.5 leading-snug"
                          style={{ color: 'var(--apple-text-primary)' }}
                        >
                          {r.title}
                        </p>
                        {r.description && (
                          <p
                            className="text-[12px] mt-1 leading-relaxed"
                            style={{
                              color: 'var(--apple-text-secondary)',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {r.description}
                          </p>
                        )}
                        <div
                          className="flex flex-wrap items-center gap-2 mt-1 text-[10px]"
                          style={{ color: 'var(--apple-text-secondary)' }}
                        >
                          {/* Mode availability badges — highlight the active mode */}
                          {r.simpleReaderUrl && (
                            <span
                              className="font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={
                                mode === 'SIMPLE'
                                  ? { background: '#0071e3', color: '#fff' }
                                  : {
                                      background: 'transparent',
                                      color: 'var(--apple-text-secondary)',
                                      border: '1px solid currentColor',
                                    }
                              }
                            >
                              Simple
                            </span>
                          )}
                          {r.ultraReaderUrl && (
                            <span
                              className="font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={
                                mode === 'ULTRA'
                                  ? {
                                      background: 'var(--apple-text-primary)',
                                      color: 'var(--apple-bg-surface)',
                                    }
                                  : {
                                      background: 'transparent',
                                      color: 'var(--apple-text-secondary)',
                                      border: '1px solid currentColor',
                                    }
                              }
                            >
                              Ultra
                            </span>
                          )}
                          {r.originalBytes > 0 && (
                            <span>{filesize(r.originalBytes)}</span>
                          )}
                          {r.savedPct !== null && (
                            <span style={{ fontWeight: 700 }}>
                              {r.savedPct}% smaller
                            </span>
                          )}
                          <span>{new Date(r.date).toLocaleDateString()}</span>
                          {r.contentHash && (
                            <span
                              className="font-mono"
                              style={{ color: 'var(--apple-text-muted)' }}
                            >
                              {r.contentHash.slice(0, 8)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-3 mt-1.5 text-[10px]"
                      style={{ color: 'var(--apple-text-secondary)' }}
                    >
                      {r.phoneNumber && (
                        <a
                          href={`tel:${r.phoneNumber}`}
                          className="font-medium"
                          style={{ color: 'var(--apple-blue)' }}
                        >
                          {r.phoneNumber}
                        </a>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p
                className="text-[13px] py-12"
                style={{ color: 'var(--apple-text-secondary)' }}
              >
                {debouncedSearch
                  ? 'No results.'
                  : 'No reader views generated yet. Analyze a site from the terminal.'}
              </p>
            )}

            {/* Pagination */}
            {totalPages > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-4 py-6">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="text-[12px] px-3 py-1.5 rounded-md disabled:opacity-30"
                  style={{ color: 'var(--apple-blue)' }}
                >
                  Previous
                </button>
                <span
                  className="text-[11px]"
                  style={{ color: 'var(--apple-text-secondary)' }}
                >
                  Page {page + 1} of {Math.ceil(totalPages / PAGE_SIZE)}
                </span>
                <button
                  type="button"
                  disabled={(page + 1) * PAGE_SIZE >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-[12px] px-3 py-1.5 rounded-md disabled:opacity-30"
                  style={{ color: 'var(--apple-blue)' }}
                >
                  Next
                </button>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reader toolbar — shows for active tab */}
      {activeTab && showingReader && (
        <div
          className="flex items-center gap-3 px-4 py-2 shrink-0"
          style={{ borderBottom: '1px solid var(--apple-border)' }}
        >
          <button
            className="flex items-center gap-1 text-[11px] font-medium"
            style={{ color: 'var(--apple-text-secondary)' }}
            onClick={backToSearch}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          {activeTab.favicon && (
            <img
              src={activeTab.favicon}
              alt=""
              className="w-4 h-4 rounded-sm shrink-0"
            />
          )}
          <span
            className="text-[11px] font-mono truncate"
            style={{ color: 'var(--apple-green)' }}
          >
            {activeTab.host}
          </span>
          <span
            className="text-[12px] truncate flex-1"
            style={{ color: 'var(--apple-text-primary)' }}
          >
            {activeTab.title}
          </span>
          {activeTab.url && (
            <a
              href={activeTab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium shrink-0 apple-secondary-btn px-2 py-1 rounded-lg"
            >
              <ExternalLink className="w-3 h-3" />
              Visit site
            </a>
          )}
          {canToggleMode && (
            <div className="flex gap-0.5 shrink-0 ml-auto">
              {(['SIMPLE', 'ULTRA'] as const).map((m) => {
                const available = m === 'SIMPLE' ? hasSimple : hasUltra
                const active = activeTab?.mode === m
                return (
                  <button
                    key={m}
                    disabled={!available}
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-colors disabled:cursor-not-allowed"
                    style={
                      active && m === 'SIMPLE'
                        ? { background: '#0071e3', color: '#fff' }
                        : active && m === 'ULTRA'
                          ? {
                              background: 'var(--apple-text-primary)',
                              color: 'var(--apple-bg-surface)',
                            }
                          : !available
                            ? {
                                background: 'transparent',
                                color: 'var(--apple-text-faint)',
                                opacity: 0.4,
                              }
                            : {
                                background: 'transparent',
                                color: 'var(--apple-text-secondary)',
                              }
                    }
                    onClick={() => available && handleModeToggle(m)}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* All tab iframes — rendered simultaneously, only active one visible */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId && showingReader
        const tabUrl =
          tab.mode === 'ULTRA'
            ? tab.ultraReaderUrl || tab.simpleReaderUrl
            : tab.simpleReaderUrl || tab.ultraReaderUrl
        return (
          <iframe
            key={tab.id}
            ref={isActive ? iframeRef : undefined}
            src={tabUrl || ''}
            className="flex-1 w-full border-0"
            style={{ display: isActive ? undefined : 'none' }}
            title={tab.title}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        )
      })}

      {/* Payment modal removed — crawling is now free */}
    </div>
  )
}

export default BrowserPage
