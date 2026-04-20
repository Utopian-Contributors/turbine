import { SearchWebsite } from '@/components/ui/search-website'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Liveline } from 'liveline'
import {
  CheckCircle,
  Clock,
  Hash,
  Loader2,
  MessageSquare,
  Search,
  Tag,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  OptimizationMode,
  useArchiveViewMutation,
  useCreateOptimizationJobMutation,
  useDashboardParseFeedMutation,
  useDashboardReaderIndexQuery,
  useLatestJobsQuery,
  useRecentKeywordBidsQuery,
  useRecentKeywordExtractionsQuery,
  useStatsQuery,
} from '../../generated/graphql'

const DOMAIN_COLORS = ['#30d158', '#0071e3', '#ff9f0a', '#ff453a', '#bf5af2']

function getRootDomain(url: string): string {
  try {
    let host = new URL(url).hostname.replace(/^www\./, '')
    const parts = host.split('.')
    if (parts.length > 2) {
      const sld = parts[parts.length - 2]
      if (['co', 'com', 'org', 'net', 'gov', 'ac', 'edu'].includes(sld)) {
        host = parts.slice(-3).join('.')
      } else {
        host = parts.slice(-2).join('.')
      }
    }
    return host
  } catch {
    return url
  }
}

function getScheduleDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const { data: statsData } = useStatsQuery()
  const { data: jobsData } = useLatestJobsQuery({ pollInterval: 5000 })
  const { data: readerData } = useDashboardReaderIndexQuery({
    pollInterval: 60000,
  })
  const { user } = useAuth()
  const [createJob] = useCreateOptimizationJobMutation()
  const [parseFeed] = useDashboardParseFeedMutation()
  const [archiveView] = useArchiveViewMutation()
  const [submitting, setSubmitting] = useState(false)

  const { data: keywordExtractionsData } = useRecentKeywordExtractionsQuery({
    variables: { take: 10 },
    pollInterval: 30000,
  })
  const { data: keywordBidsData } = useRecentKeywordBidsQuery({
    variables: { take: 10 },
    pollInterval: 15000,
  })

  // Merge keyword extractions and bids into a unified feed
  const keywordFeed = useMemo(() => {
    const extractions = (
      keywordExtractionsData?.recentKeywordExtractions ?? []
    ).map((e) => ({
      type: 'extraction' as const,
      id: `ext-${e.id}`,
      timestamp: new Date(e.extractedAt).getTime(),
      keyword: e.keyword,
      frequency: e.frequency,
      jobId: e.jobId,
      url: e.job?.url ?? '',
      title: e.job?.seoTitle ?? '',
      favicon: e.job?.faviconPath ?? null,
    }))
    const bids = (keywordBidsData?.recentKeywordBids ?? []).map((b) => ({
      type: 'bid' as const,
      id: `bid-${b.id}`,
      timestamp: new Date(b.timestamp).getTime(),
      keyword: b.keyword?.keyword ?? '',
      amount: b.amount,
      sender: b.sender,
      jobId: b.jobId,
      url: b.keyword?.job?.url ?? '',
      title: b.keyword?.job?.seoTitle ?? '',
      favicon: b.keyword?.job?.faviconPath ?? null,
    }))
    return [...extractions, ...bids]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 15)
  }, [keywordExtractionsData, keywordBidsData])

  const sessionData = useMemo(() => {
    const readerEntries = (readerData?.readerIndex ?? []).map((e) => ({
      url: e.url,
      createdAt: e.createdAt,
    }))
    const jobEntries = (jobsData?.optimizationJobs ?? []).map((j) => ({
      url: j.url,
      createdAt: j.createdAt,
    }))
    const entries = readerEntries.length > 0 ? readerEntries : jobEntries

    const sorted = [...entries].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    if (sorted.length === 0) {
      return { series: [], allPoints: [], total: 0 }
    }

    const totals = new Map<string, number>()
    for (const e of sorted) {
      const host = getRootDomain(e.url)
      totals.set(host, (totals.get(host) ?? 0) + 1)
    }
    const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1])
    const topDomains = ranked.slice(0, 5).map(([d]) => d)

    const cumCounts = new Map<string, number>()
    const domainPoints = new Map<string, { time: number; value: number }[]>()
    for (const d of topDomains) {
      cumCounts.set(d, 0)
      domainPoints.set(d, [])
    }

    for (const e of sorted) {
      const host = getRootDomain(e.url)
      if (!cumCounts.has(host)) continue
      const time = Math.floor(new Date(e.createdAt).getTime() / 1000)
      cumCounts.set(host, cumCounts.get(host)! + 1)
      domainPoints.get(host)!.push({ time, value: cumCounts.get(host)! })
    }

    const pad = (pts: { time: number; value: number }[]) => {
      if (pts.length === 1)
        return [{ time: pts[0].time - 60, value: 0 }, ...pts]
      return pts
    }

    const series = topDomains.map((domain, i) => ({
      id: domain,
      label: domain,
      color: DOMAIN_COLORS[i % DOMAIN_COLORS.length],
      data: pad(domainPoints.get(domain)!),
      value: cumCounts.get(domain)!,
    }))

    const allPoints: { time: number; value: number }[] = []
    let cum = 0
    for (const e of sorted) {
      cum++
      allPoints.push({
        time: Math.floor(new Date(e.createdAt).getTime() / 1000),
        value: cum,
      })
    }

    const windowSecs =
      allPoints.length >= 2
        ? allPoints[allPoints.length - 1].time - allPoints[0].time + 120
        : 3600

    return {
      series,
      allPoints: pad(allPoints),
      total: sorted.length,
      windowSecs,
    }
  }, [readerData, jobsData])

  useEffect(() => {
    document.title = 'Utopian'
  }, [])

  const handleSearch = useCallback(
    async (url: string) => {
      if (!url || url === 'https://') return
      setSubmitting(true)
      try {
        const feedResult = await parseFeed({ variables: { url } })
        const feedItems = feedResult.data?.parseFeed ?? []

        if (feedItems && feedItems.length > 0) {
          navigate(`/batch?feed=${encodeURIComponent(url)}`)
          return
        }

        const { data } = await createJob({
          variables: { url, mode: OptimizationMode.Simple },
        })
        const jobId = data?.createOptimizationJob?.id
        if (jobId) {
          if (user?.id) {
            archiveView({
              variables: { userId: user.id, jobId },
            }).catch(() => {})
          }
          navigate(`/jobs/${jobId}`)
        }
      } finally {
        setSubmitting(false)
      }
    },
    [createJob, parseFeed, navigate, user, archiveView],
  )

  const statusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <CheckCircle className="w-3.5 h-3.5" style={{ color: '#30d158' }} />
        )
      case 'PROCESSING':
        return (
          <Loader2
            className="w-3.5 h-3.5 animate-spin"
            style={{ color: '#ff9f0a' }}
          />
        )
      case 'FAILED':
        return <XCircle className="w-3.5 h-3.5" style={{ color: '#ff453a' }} />
      default:
        return <Clock className="w-3.5 h-3.5" style={{ color: '#8e8e93' }} />
    }
  }

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        {/* Scrape input */}
        <div className="flex flex-col gap-2 mb-10">
          <SearchWebsite
            type="search"
            prefix="https://"
            size={24}
            initial=""
            autoFocus
            onSearch={handleSearch}
            className="w-full"
          />
          <p
            className="text-[10px] text-center uppercase tracking-widest font-medium"
            style={{
              color: 'var(--apple-text-muted)',
              letterSpacing: '0.14em',
            }}
          >
            Free &middot; No wallet needed
          </p>
          {submitting && (
            <p className="text-center text-xs mt-1 animate-pulse">
              Submitting...
            </p>
          )}
        </div>

        {/* Sessions chart — recessed display well */}
        <div
          className="mb-10 rounded-2xl overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, var(--apple-bg-input) 0%, var(--apple-bg-inactive) 100%)',
            boxShadow:
              'inset 0 2px 6px rgba(0,0,0,0.10), inset 0 1px 2px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.7)',
            border: '1px solid var(--apple-border)',
          }}
        >
          <div className="px-5 pt-4 pb-1 flex items-baseline justify-between">
            <p
              className="text-[9px] font-bold uppercase"
              style={{
                color: 'var(--apple-text-muted)',
                letterSpacing: '0.18em',
              }}
            >
              Sessions
            </p>
            <p
              className="text-[22px] font-bold tabular-nums"
              style={{ color: 'var(--apple-text-primary)' }}
            >
              {sessionData.total}
            </p>
          </div>
          {sessionData.allPoints.length > 0 ? (
            <div style={{ height: 220 }}>
              <Liveline
                data={sessionData.allPoints}
                value={sessionData.total}
                series={
                  sessionData.series.length > 0 ? sessionData.series : undefined
                }
                window={sessionData.windowSecs}
                theme={theme}
                color="#30d158"
                grid
                fill={sessionData.series.length === 0}
                pulse={false}
                lineWidth={2}
                badge={false}
                formatValue={(v) => Math.round(v).toString()}
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ height: 220 }}
            >
              <p
                className="text-[12px]"
                style={{ color: 'var(--apple-text-muted)' }}
              >
                Analyze a site to see sessions here.
              </p>
            </div>
          )}
        </div>

        {/* Network Pulse — raised stat gauges */}
        <div className="flex gap-3 mb-10">
          {[
            {
              label: 'Pages Indexed',
              value: statsData?.stats?.totalJobs ?? 0,
            },
            {
              label: 'Keywords',
              value:
                keywordExtractionsData?.recentKeywordExtractions?.length ?? 0,
            },
            {
              label: 'Active Bids',
              value:
                keywordBidsData?.recentKeywordBids?.filter((b) => b.keyword)
                  ?.length ?? 0,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-2xl px-4 py-4 apple-panel"
            >
              <p
                className="text-[22px] font-bold tabular-nums"
                style={{ color: 'var(--apple-text-primary)' }}
              >
                {s.value}
              </p>
              <p
                className="text-[9px] font-bold uppercase mt-1"
                style={{
                  color: 'var(--apple-text-muted)',
                  letterSpacing: '0.16em',
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Keyword Activity Feed */}
        <div className="mb-10">
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <Hash
              className="w-3 h-3"
              style={{ color: 'var(--apple-text-muted)' }}
            />
            <p
              className="text-[9px] font-bold uppercase flex-1"
              style={{
                color: 'var(--apple-text-muted)',
                letterSpacing: '0.18em',
              }}
            >
              Keyword Activity
            </p>
          </div>
          {keywordFeed.length > 0 ? (
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
              {keywordFeed.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.3)]"
                  style={{
                    borderTop:
                      i > 0 ? '1px solid var(--apple-divider)' : undefined,
                  }}
                  onClick={() => navigate(`/keywords/${item.jobId}`)}
                >
                  {item.type === 'extraction' ? (
                    <Tag
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: '#30d158' }}
                    />
                  ) : (
                    <TrendingUp
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: '#ff9f0a' }}
                    />
                  )}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.favicon && (
                      <img
                        src={item.favicon}
                        alt=""
                        className="w-4 h-4 rounded-sm"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.type === 'extraction' ? (
                      <>
                        <p
                          className="text-[12px] font-medium truncate"
                          style={{ color: 'var(--apple-text-primary)' }}
                        >
                          <span style={{ color: '#30d158' }}>
                            #{item.keyword}
                          </span>{' '}
                          indexed
                        </p>
                        <p
                          className="text-[9px] truncate"
                          style={{ color: 'var(--apple-text-muted)' }}
                        >
                          {item.title || getScheduleDomain(item.url)} &middot;{' '}
                          {item.frequency}x mentions
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          className="text-[12px] font-medium truncate"
                          style={{ color: 'var(--apple-text-primary)' }}
                        >
                          bid {item.amount} $UTCC on{' '}
                          <span style={{ color: '#ff9f0a' }}>
                            #{item.keyword}
                          </span>
                        </p>
                        <p
                          className="text-[9px] font-mono truncate"
                          style={{ color: 'var(--apple-text-muted)' }}
                        >
                          {item.sender.slice(0, 6)}...{item.sender.slice(-4)}{' '}
                          &middot;{' '}
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="text-[11px] text-center py-4"
              style={{ color: 'var(--apple-text-muted)' }}
            >
              No keyword activity yet. Extract keywords from a page to get
              started.
            </p>
          )}
        </div>

        {/* Quick Actions — raised pill with physical button segments */}
        <div
          className="flex rounded-2xl overflow-hidden mb-10"
          style={{
            background:
              'linear-gradient(180deg, var(--apple-bg-elevated) 0%, var(--apple-bg-surface) 100%)',
            border: '1px solid var(--apple-border)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.88), 0 2px 6px rgba(20,18,14,0.07), 0 8px 24px rgba(20,18,14,0.10)',
          }}
        >
          {[
            {
              label: 'Ask the Agent',
              desc: 'Query content with AI',
              icon: MessageSquare,
              color: '#0071e3',
              route: '/agent/new',
            },
            {
              label: 'Browse Index',
              desc: 'Search all indexed pages',
              icon: Search,
              color: '#30d158',
              route: '/browser',
            },
            {
              label: 'Keywords',
              desc: 'Bid on keyword auctions',
              icon: Tag,
              color: '#ff9f0a',
              route: '/keywords',
            },
          ].map((action, i) => (
            <button
              key={action.label}
              className="flex-1 flex items-center gap-2.5 px-4 py-3.5 cursor-pointer transition-all active:bg-[var(--apple-bg-inactive)]"
              style={{
                borderRight:
                  i < 2 ? '1px solid var(--apple-border)' : undefined,
              }}
              onClick={() => navigate(action.route)}
            >
              <action.icon
                className="w-4 h-4 shrink-0"
                style={{ color: action.color }}
              />
              <div className="min-w-0 text-left">
                <p
                  className="text-[12px] font-medium leading-tight"
                  style={{ color: 'var(--apple-text-primary)' }}
                >
                  {action.label}
                </p>
                <p
                  className="text-[9px] leading-tight mt-0.5"
                  style={{ color: 'var(--apple-text-muted)' }}
                >
                  {action.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Recent Activity — recessed list tray */}
        {jobsData?.optimizationJobs?.length ? (
          <div>
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <Clock
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
                Recent Activity
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
              {jobsData.optimizationJobs.map((job, i) => (
                <div
                  key={job.id}
                  className="flex items-center gap-2.5 px-5 py-3 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.3)]"
                  style={{
                    borderTop:
                      i > 0 ? '1px solid var(--apple-divider)' : undefined,
                  }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  {statusIcon(job.status)}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium truncate"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      {(() => {
                        try {
                          return new URL(job.url).hostname
                        } catch {
                          return job.url
                        }
                      })()}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: 'var(--apple-text-secondary)' }}
                    >
                      {new Date(job.createdAt).toLocaleDateString()} &middot;{' '}
                      {job.optimizedFiles?.length ?? 0} files
                    </p>
                  </div>
                  <span
                    className="text-[11px]"
                    style={{ color: 'var(--apple-text-faint)' }}
                  >
                    &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default DashboardPage
