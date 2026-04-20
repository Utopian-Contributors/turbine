import { Identicon } from '@/components/ui/Identicon'
import { Card, Carousel } from '@/components/ui/apple-cards-carousel'
import { Globe, Hash, Users } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  usePopularArticlesQuery,
  usePopularDomainsQuery,
  usePopularUsersQuery,
  useTopKeywordBidsQuery,
} from '../../generated/graphql'

interface PopularDomain {
  domain: string
  totalViews: number
  faviconPath: string | null
  jobCount: number
}

interface PopularUser {
  walletAddress: string
  archiveCount: number
  totalViews: number
}

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate()

  const { data: domainsData } = usePopularDomainsQuery({
    variables: { take: 12 },
    pollInterval: 60000,
  })

  const { data: usersData } = usePopularUsersQuery({
    variables: { take: 12 },
    pollInterval: 60000,
  })

  const { data: topBidsData } = useTopKeywordBidsQuery({
    variables: { take: 20 },
    pollInterval: 30000,
  })

  const topBids = topBidsData?.topKeywordBids ?? []

  const PAGE_SIZE = 5
  const { data: articlesData, fetchMore } = usePopularArticlesQuery({
    variables: { take: PAGE_SIZE, skip: 0 },
  })
  const [allArticles, setAllArticles] = useState<NonNullable<typeof articlesData>['popularArticles']>([])
  const [hasMore, setHasMore] = useState(true)
  const loadingMore = useRef(false)
  const initialLoaded = useRef(false)

  useEffect(() => {
    if (articlesData?.popularArticles && !initialLoaded.current) {
      initialLoaded.current = true
      setAllArticles(articlesData.popularArticles)
      if (articlesData.popularArticles.length < PAGE_SIZE) setHasMore(false)
    }
  }, [articlesData])

  const handleEndReached = useCallback(async () => {
    if (loadingMore.current || !hasMore) return
    loadingMore.current = true
    try {
      const result = await fetchMore({ variables: { take: PAGE_SIZE, skip: allArticles.length } })
      const more = result.data?.popularArticles ?? []
      if (more.length === 0 || more.length < PAGE_SIZE) setHasMore(false)
      if (more.length > 0) setAllArticles(prev => [...prev, ...more])
    } finally {
      loadingMore.current = false
    }
  }, [allArticles.length, fetchMore, hasMore])

  useEffect(() => {
    document.title = 'Utopian | Discover'
  }, [])

  const domains = (domainsData?.popularDomains ?? []) as PopularDomain[]
  const users = (usersData?.popularUsers ?? []) as PopularUser[]

  const isInitialLoading = articlesData === undefined
  const carouselItems = allArticles.map((a, i) => (
    <Card
      key={a.id}
      index={i}
      card={{
        src: a.compressedPreviewImage ?? a.seoOgImage!,
        title: a.seoTitle ?? new URL(a.url).hostname,
        category: new URL(a.url).hostname.replace(/^www\./, ''),
        content: <p className="text-sm">{a.seoDescription ?? ''}</p>,
        href: `${window.location.origin}/browser/${a.id}/simple`,
      }}
    />
  ))

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-4xl mx-auto px-5 pt-4 pb-16">
        {(isInitialLoading || carouselItems.length > 0) && <Carousel items={carouselItems} onEndReached={handleEndReached} />}

        {/* Keyword Mosaic */}
        {topBids.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-4">
              <Hash className="w-3.5 h-3.5" style={{ color: '#ff9f0a' }} />
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--apple-text-muted)' }}
              >
                Top Keyword Bids
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {topBids.map((bid) => {
                const maxBid = topBids[0]?.amount ?? 1
                const scale = Math.max(0.7, Math.min(1.3, bid.amount / maxBid + 0.5))
                return (
                  <button
                    key={bid.id}
                    className="rounded-xl px-3 py-2 transition-all active:scale-[0.97] apple-panel"
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'center',
                    }}
                    onClick={() => {
                      const jobId = bid.keyword?.jobId ?? bid.keyword?.job?.id
                      if (jobId) navigate(`/keywords/${jobId}`)
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {bid.keyword?.job?.faviconPath && (
                        <img
                          src={bid.keyword.job.faviconPath}
                          alt=""
                          className="w-3 h-3 rounded-sm shrink-0"
                        />
                      )}
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: '#ff9f0a' }}
                      >
                        #{bid.keyword?.keyword ?? '...'}
                      </span>
                    </div>
                    <p
                      className="text-[9px] font-bold mt-0.5"
                      style={{ color: 'var(--apple-text-secondary)' }}
                    >
                      {bid.amount} $UTCC
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Popular Domains */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <Globe className="w-3.5 h-3.5" style={{ color: '#30d158' }} />
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--apple-text-muted)' }}
              >
                Popular Domains
              </p>
            </div>

            <div className="rounded-xl overflow-hidden apple-panel-soft">
              {domains.map((d, i) => (
                <div
                  key={d.domain}
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer apple-list-item"
                  style={{
                    borderTop:
                      i > 0 ? '1px solid var(--apple-divider)' : undefined,
                  }}
                  onClick={() => navigate(`/domain/${d.domain}`)}
                >
                  <span
                    className="text-[10px] font-bold w-4 text-right"
                    style={{ color: 'var(--apple-text-faint)' }}
                  >
                    {i + 1}
                  </span>
                  {d.faviconPath ? (
                    <img
                      src={d.faviconPath}
                      alt=""
                      className="w-5 h-5 rounded-sm shrink-0"
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-sm shrink-0"
                      style={{ background: 'var(--apple-bg-inactive)' }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium truncate"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      {d.domain}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-[11px] font-semibold"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      {d.totalViews}
                    </p>
                    <p
                      className="text-[9px]"
                      style={{ color: 'var(--apple-text-faint)' }}
                    >
                      {d.jobCount} job{d.jobCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}

              {domains.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <Globe
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: 'var(--apple-text-faint)' }}
                  />
                  <p
                    className="text-[12px]"
                    style={{ color: 'var(--apple-text-secondary)' }}
                  >
                    No domains yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Users */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <Users className="w-3.5 h-3.5" style={{ color: '#007aff' }} />
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--apple-text-muted)' }}
              >
                Active Users
              </p>
            </div>

            <div className="rounded-xl overflow-hidden apple-panel-soft">
              {users.map((u, i) => (
                <div
                  key={u.walletAddress}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{
                    borderTop:
                      i > 0 ? '1px solid var(--apple-divider)' : undefined,
                  }}
                >
                  <span
                    className="text-[10px] font-bold w-4 text-right"
                    style={{ color: 'var(--apple-text-faint)' }}
                  >
                    {i + 1}
                  </span>
                  <Identicon hash={u.walletAddress} size={20} />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12px] font-mono truncate"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      {u.walletAddress.slice(0, 4)}...
                      {u.walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-[11px] font-semibold"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      {u.archiveCount}
                    </p>
                    <p
                      className="text-[9px]"
                      style={{ color: 'var(--apple-text-faint)' }}
                    >
                      scrape{u.archiveCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <Users
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: 'var(--apple-text-faint)' }}
                  />
                  <p
                    className="text-[12px]"
                    style={{ color: 'var(--apple-text-secondary)' }}
                  >
                    No users yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverPage
