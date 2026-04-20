import { useAuth } from '@/contexts/AuthContext'
import {
  Hash,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import {
  useKeywordBidsForWalletQuery,
  useMyArchiveQuery,
} from '../../generated/graphql'

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const KeywordsOverviewPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: archiveData, refetch: refetchArchive } = useMyArchiveQuery({
    variables: { userId: user?.id ?? '', pagination: { take: 200 } },
    skip: !user?.id,
    pollInterval: 30000,
  })

  const { data: bidsData, refetch: refetchBids } =
    useKeywordBidsForWalletQuery({
      variables: { walletAddress: user?.walletAddress ?? '' },
      skip: !user?.walletAddress,
      pollInterval: 15000,
    })

  useEffect(() => {
    document.title = 'Utopian | Keywords'
  }, [])

  const handleRefresh = useCallback(async () => {
    await refetchArchive()
    refetchBids()
  }, [refetchArchive, refetchBids])

  // Deduplicate archive entries by jobId
  const archivedJobs = useMemo(() => {
    const entries = (archiveData?.myArchive ?? []) as Array<{
      id: string
      jobId: string
      createdAt: string
      job: {
        id: string
        url: string
        seoTitle: string | null
        seoDescription: string | null
        faviconPath: string | null
        compressedPreviewImage: string | null
      } | null
    }>
    const byJobId = new Map<string, (typeof entries)[number]>()
    for (const entry of entries) {
      if (!entry.job?.id) continue
      const existing = byJobId.get(entry.job.id)
      if (
        !existing ||
        new Date(entry.createdAt).getTime() >
          new Date(existing.createdAt).getTime()
      ) {
        byJobId.set(entry.job.id, entry)
      }
    }
    return Array.from(byJobId.values())
  }, [archiveData])

  const myBids = bidsData?.keywordBidsForWallet ?? []

  // Group bids by jobId for badge counts
  const bidsByJob = useMemo(() => {
    const map = new Map<string, { total: number; winning: number }>()
    for (const bid of myBids) {
      const entry = map.get(bid.jobId) ?? { total: 0, winning: 0 }
      entry.total++
      if (bid.active) entry.winning++
      map.set(bid.jobId, entry)
    }
    return map
  }, [myBids])

  // Pages where user has active bids (shown first)
  const pagesWithBids = useMemo(() => {
    const jobIds = new Set(myBids.map((b) => b.jobId))
    return archivedJobs.filter((a) => a.job && jobIds.has(a.job.id))
  }, [archivedJobs, myBids])

  // Pages without bids
  const pagesWithoutBids = useMemo(() => {
    const jobIds = new Set(myBids.map((b) => b.jobId))
    return archivedJobs.filter((a) => a.job && !jobIds.has(a.job.id))
  }, [archivedJobs, myBids])

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="relative max-w-3xl mx-auto px-5 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-[18px] font-semibold"
              style={{ color: 'var(--apple-text-primary)' }}
            >
              Keyword Auctions
            </h1>
            <p
              className="text-[12px] mt-1"
              style={{ color: 'var(--apple-text-secondary)' }}
            >
              Bid on keywords to place ads in page content
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {/* My active bids summary */}
        {myBids.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <TrendingUp
                className="w-3 h-3"
                style={{ color: 'var(--apple-text-muted)' }}
              />
              <p
                className="text-[9px] font-bold uppercase"
                style={{
                  color: 'var(--apple-text-muted)',
                  letterSpacing: '0.18em',
                }}
              >
                My Active Bids
              </p>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, var(--apple-bg-input) 0%, var(--apple-bg-inactive) 100%)',
                boxShadow:
                  'inset 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 1px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.7)',
                border: '1px solid var(--apple-border)',
              }}
            >
              {myBids.slice(0, 10).map((bid, i) => (
                <div
                  key={bid.id}
                  className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.3)]"
                  style={{
                    borderTop:
                      i > 0
                        ? '1px solid var(--apple-divider)'
                        : undefined,
                  }}
                  onClick={() => navigate(`/keywords/${bid.jobId}`)}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: bid.active
                        ? '#30d158'
                        : 'var(--apple-text-muted)',
                      boxShadow: bid.active
                        ? '0 0 4px #30d15866'
                        : undefined,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12px] font-semibold truncate"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      #{bid.keyword?.keyword ?? '...'}
                    </p>
                    <p
                      className="text-[9px] truncate"
                      style={{ color: 'var(--apple-text-muted)' }}
                    >
                      {bid.keyword?.job?.seoTitle ??
                        (bid.keyword?.job?.url
                          ? getHostname(bid.keyword.job.url)
                          : '...')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {bid.active && (
                      <span
                        className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{
                          background: '#30d158',
                          color: '#fff',
                        }}
                      >
                        Winning
                      </span>
                    )}
                    <span
                      className="text-[11px] font-bold tabular-nums"
                      style={{
                        color: 'var(--apple-text-secondary)',
                      }}
                    >
                      {bid.amount} $UTCC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages grid */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <Hash
              className="w-3 h-3"
              style={{ color: 'var(--apple-text-muted)' }}
            />
            <p
              className="text-[9px] font-bold uppercase"
              style={{
                color: 'var(--apple-text-muted)',
                letterSpacing: '0.18em',
              }}
            >
              Your Pages
            </p>
          </div>

          {archivedJobs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...pagesWithBids, ...pagesWithoutBids].map((archive) => {
                const job = archive.job
                if (!job) return null
                const host = getHostname(job.url)
                const bidInfo = bidsByJob.get(job.id)

                return (
                  <div
                    key={archive.id}
                    className="rounded-xl overflow-hidden apple-panel-soft transition-all cursor-pointer"
                    onClick={() => navigate(`/keywords/${job.id}`)}
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={
                          job.compressedPreviewImage ||
                          '/utopian-icon.webp'
                        }
                        alt={job.seoTitle ?? host}
                        className="w-full h-full object-cover"
                      />
                      {bidInfo && (
                        <div className="absolute top-2 right-2">
                          <div
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                            style={{
                              background:
                                bidInfo.winning > 0
                                  ? '#30d158'
                                  : '#ff9500',
                              color: '#fff',
                            }}
                          >
                            <TrendingUp className="w-2.5 h-2.5" />
                            {bidInfo.winning > 0
                              ? `${bidInfo.winning} winning`
                              : `${bidInfo.total} bid${bidInfo.total !== 1 ? 's' : ''}`}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        {job.faviconPath && (
                          <img
                            src={job.faviconPath}
                            alt=""
                            className="w-3 h-3 rounded-sm shrink-0"
                          />
                        )}
                        <p
                          className="text-[10px] font-mono truncate"
                          style={{
                            color: 'var(--apple-text-muted)',
                          }}
                        >
                          {host}
                        </p>
                      </div>
                      <p
                        className="text-[12px] font-medium leading-snug truncate"
                        style={{
                          color: 'var(--apple-text-primary)',
                        }}
                      >
                        {job.seoTitle || host}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl p-10 text-center apple-panel-soft">
              <Hash
                className="w-8 h-8 mx-auto mb-2"
                style={{ color: 'var(--apple-text-faint)' }}
              />
              <p
                className="text-[13px]"
                style={{ color: 'var(--apple-text-secondary)' }}
              >
                No archived pages yet. Search for a page to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KeywordsOverviewPage
