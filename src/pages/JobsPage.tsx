import { useTheme } from '@/contexts/ThemeContext'
import { filesize } from 'filesize'
import { Liveline } from 'liveline'
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router'
import { useOptimizationJobsQuery } from '../../generated/graphql'

function getHostname(url: string): string {
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
  } catch { return url }
}

function getJobSummary(job: { optimizedFiles?: { isBestVariant?: boolean | null; originalUrl?: string | null; id: string; originalSize?: string | number | null; optimizedSize?: string | number | null }[] | null }) {
  // Deduplicate by originalUrl, pick best variant per file
  const seen = new Set<string>()
  let original = 0
  let optimized = 0
  let fileCount = 0

  for (const f of job.optimizedFiles ?? []) {
    if (!f.isBestVariant) continue
    const key = f.originalUrl ?? f.id
    if (seen.has(key)) continue
    seen.add(key)
    original += Number(f.originalSize)
    optimized += Number(f.optimizedSize)
    fileCount++
  }

  const saved = Math.max(0, original - optimized)
  const pct = original > 0 ? (saved / original) * 100 : 0
  return { fileCount, saved, pct }
}

const DOMAIN_COLORS = ['#30d158', '#0071e3', '#ff9f0a', '#ff453a', '#bf5af2']

const JobsPage: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { data, fetchMore } = useOptimizationJobsQuery({
    variables: { pagination: { take: 20 } },
    pollInterval: 30000,
  })

  const [hasMore, setHasMore] = useState(true)
  const { ref: loadMoreRef, inView } = useInView()

  useEffect(() => { document.title = 'Tumbler | Jobs' }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || !data?.optimizationJobs?.length) return
    fetchMore({
      variables: { pagination: { skip: data.optimizationJobs.length, take: 20 } },
      updateQuery: (prev, { fetchMoreResult }) => {
        if ((fetchMoreResult.optimizationJobs?.length ?? 0) < 20) setHasMore(false)
        if (prev.optimizationJobs && fetchMoreResult.optimizationJobs?.length) {
          return { optimizationJobs: [...prev.optimizationJobs, ...fetchMoreResult.optimizationJobs] }
        }
        return prev
      },
    })
  }, [data?.optimizationJobs?.length, fetchMore, hasMore])

  useEffect(() => { if (inView && hasMore) loadMore() }, [inView, hasMore, loadMore])

  const jobs = useMemo(() => {
    return [...(data?.optimizationJobs ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [data?.optimizationJobs])

  // Jobs over time per domain for Liveline multi-series
  const jobsSeries = useMemo(() => {
    const sorted = [...jobs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    if (sorted.length === 0) return { series: [], allPoints: [], total: 0 }

    // Top 5 domains by count
    const totals = new Map<string, number>()
    for (const j of sorted) {
      const host = getHostname(j.url)
      totals.set(host, (totals.get(host) ?? 0) + 1)
    }
    const topDomains = [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([d]) => d)

    // Cumulative per domain
    const cumCounts = new Map<string, number>()
    const domainPoints = new Map<string, { time: number; value: number }[]>()
    for (const d of topDomains) {
      cumCounts.set(d, 0)
      domainPoints.set(d, [])
    }
    for (const j of sorted) {
      const host = getHostname(j.url)
      if (!cumCounts.has(host)) continue
      cumCounts.set(host, cumCounts.get(host)! + 1)
      domainPoints.get(host)!.push({
        time: Math.floor(new Date(j.createdAt).getTime() / 1000),
        value: cumCounts.get(host)!,
      })
    }

    // Liveline needs >= 2 points to render
    const pad = (pts: { time: number; value: number }[]) => {
      if (pts.length === 1) return [{ time: pts[0].time - 60, value: 0 }, ...pts]
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
    for (const j of sorted) {
      cum++
      allPoints.push({ time: Math.floor(new Date(j.createdAt).getTime() / 1000), value: cum })
    }

    // Window spans from first to last point + buffer
    const windowSecs = allPoints.length >= 2
      ? allPoints[allPoints.length - 1].time - allPoints[0].time + 120
      : 3600

    return { series, allPoints: pad(allPoints), total: sorted.length, windowSecs }
  }, [jobs])

  const statusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-3.5 h-3.5" style={{ color: '#30d158' }} />
      case 'PROCESSING': return <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#ff9f0a' }} />
      case 'FAILED': return <XCircle className="w-3.5 h-3.5" style={{ color: '#ff453a' }} />
      default: return <Clock className="w-3.5 h-3.5" style={{ color: '#999' }} />
    }
  }

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        {/* Liveline chart — jobs over time by domain */}
        {jobsSeries.allPoints.length > 0 && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <div className="px-4 pb-1 flex items-baseline justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--apple-text-muted)' }}>
                Jobs
              </p>
              <p className="text-[20px] font-bold tabular-nums" style={{ color: 'var(--apple-text-primary)' }}>
                {jobsSeries.total}
              </p>
            </div>
            <div style={{ height: 180 }}>
              <Liveline
                data={jobsSeries.allPoints}
                value={jobsSeries.total}
                series={jobsSeries.series.length > 0 ? jobsSeries.series : undefined}
                window={jobsSeries.windowSecs}
                theme={theme}
                color="#30d158"
                grid
                fill={jobsSeries.series.length === 0}
                badge={false}
                pulse={false}
                lineWidth={2}
                formatValue={(v) => Math.round(v).toString()}
              />
            </div>
          </div>
        )}

        {jobs.length ? (
          <div className="flex flex-col gap-1.5">
            {jobs.map((job, i) => {
              const summary = getJobSummary(job)
              return (
                <div
                  key={job.id}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer apple-list-item"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  ref={i === jobs.length - 1 ? loadMoreRef : undefined}
                >
                  {(job as unknown as Record<string, unknown>).faviconPath
                    ? <img src={(job as unknown as Record<string, unknown>).faviconPath as string} alt="" className="w-4 h-4 shrink-0" />
                    : statusIcon(job.status)
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                      {getHostname(job.url)}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--apple-text-secondary)' }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                      {summary.fileCount > 0 && (
                        <>
                          {' '}&middot; {summary.fileCount} file{summary.fileCount !== 1 ? 's' : ''}
                          {' '}&middot; <span style={{ color: '#30d158' }}>{summary.pct.toFixed(0)}% saved</span>
                          {' '}&middot; {filesize(summary.saved)}
                        </>
                      )}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      background: job.mode === 'ULTRA' ? '#1d1d1f' : '#0071e3',
                      color: '#fff',
                    }}
                  >
                    {job.mode.toLowerCase()}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl p-12 text-center apple-panel">
            <p style={{ color: 'var(--apple-text-secondary)' }}>No jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobsPage
