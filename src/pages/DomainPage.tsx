import { useTheme } from '@/contexts/ThemeContext'
import { normalizeDomain } from '@/helpers/normalizeDomain'
import type { LivelinePoint } from 'liveline'
import { Liveline } from 'liveline'
import {
  CheckCircle,
  Clock,
  Globe,
  Loader2,
  MessageSquare,
  Rss,
  XCircle,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  useDomainHashTimelineQuery,
  useDomainJobsQuery,
} from '../../generated/graphql'

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function hashToHue(hash: string): number {
  return parseInt(hash.slice(0, 6), 16) % 360
}

interface HashTimelineProps {
  entries: Array<{
    hash: string
    createdAt: string
  }>
}

const HashTimeline: React.FC<HashTimelineProps> = ({ entries }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<{
    hash: string
    createdAt: string
    x: number
  } | null>(null)
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (entries.length === 0) return null

  return (
    <div className="mb-4">
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color: 'var(--apple-text-muted)' }}
      >
        Content history · {entries.length} unique version
        {entries.length !== 1 ? 's' : ''}
      </p>
      <div
        ref={containerRef}
        className="relative flex justify-between w-full"
        style={{ height: 32 }}
      >
        {entries.map((entry) => {
          const hue = hashToHue(entry.hash)
          const color = `hsl(${hue}, 60%, 55%)`
          return (
            <div
              key={entry.hash}
              className="h-full w-1"
              style={{
                background: color,
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
                const rect = containerRef.current?.getBoundingClientRect()
                const x = e.clientX - (rect?.left ?? 0)
                const entry_ = entry
                showTimerRef.current = setTimeout(() => {
                  setHovered({
                    hash: entry_.hash,
                    createdAt: entry_.createdAt,
                    x,
                  })
                }, 120)
              }}
              onMouseLeave={() => {
                if (showTimerRef.current) clearTimeout(showTimerRef.current)
                hideTimerRef.current = setTimeout(() => setHovered(null), 200)
              }}
            />
          )
        })}

        {hovered &&
          (() => {
            const containerWidth = containerRef.current?.offsetWidth ?? 300
            const tooltipWidth = 200
            const left = Math.min(
              Math.max(hovered.x - tooltipWidth / 2, 0),
              containerWidth - tooltipWidth,
            )
            return (
              <div
                className="absolute pointer-events-none px-2.5 py-1.5 rounded-lg z-10"
                style={{
                  bottom: 'calc(100% + 6px)',
                  left,
                  width: tooltipWidth,
                  background: 'var(--apple-bg-elevated)',
                  border: '1px solid var(--apple-border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }}
              >
                <p
                  className="text-[9px] font-mono truncate"
                  style={{ color: 'var(--apple-text-primary)' }}
                >
                  {hovered.hash}
                </p>
                <p
                  className="text-[9px] mt-0.5"
                  style={{ color: 'var(--apple-text-muted)' }}
                >
                  {new Date(hovered.createdAt).toLocaleString()}
                </p>
              </div>
            )
          })()}
      </div>
    </div>
  )
}

// ── 24-hour Track Clock ──

const DomainPage: React.FC = () => {
  const { domain: rawDomain } = useParams<{ domain: string }>()
  const domain = rawDomain ? normalizeDomain(rawDomain) : ''
  const navigate = useNavigate()
  const { theme } = useTheme()
  const apiBase =
    import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '').replace('/graphql', '') ||
    'http://localhost:4000'

  const { data: jobsData } = useDomainJobsQuery({
    variables: { domain, pagination: { take: 500 } },
    skip: !domain,
    pollInterval: 10000,
  })

  const { data: timelineData } = useDomainHashTimelineQuery({
    variables: { domain },
    skip: !domain,
    pollInterval: 60000,
  })

  const [livelineData, setLivelineData] = useState<LivelinePoint[]>([])
  const [activeJobsValue, setActiveJobsValue] = useState(0)

  const completedJobs = useMemo(
    () => jobsData?.completed ?? [],
    [jobsData?.completed],
  )
  const activeJobs = jobsData?.active ?? []
  const activeJobCount = activeJobs.length
  const favicon = completedJobs.find((j) => j.faviconPath)?.faviconPath ?? null

  useEffect(() => {
    document.title = domain ? `${domain} | Utopian` : 'Utopian'
  }, [domain])

  useEffect(() => {
    setActiveJobsValue(activeJobCount)
    setLivelineData((prev) => {
      const now = Math.floor(Date.now() / 1000)
      const updated = [...prev, { time: now, value: activeJobCount }]
      return updated.slice(-60)
    })
  }, [activeJobCount])

  const handleChatAboutDomain = useCallback(() => {
    if (!domain) return
    navigate(`/agent/new?domain=${encodeURIComponent(domain)}`)
  }, [domain, navigate])

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

  if (!domain) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center apple-page">
        <p
          className="text-[13px]"
          style={{ color: 'var(--apple-text-secondary)' }}
        >
          Invalid domain
        </p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        {/* Header */}
        <div className="rounded-xl p-5 mb-4 apple-panel">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
              style={{
                background: 'var(--apple-bg-surface)',
                border: '1px solid var(--apple-border)',
              }}
            >
              {favicon ? (
                <img src={favicon} alt="" className="w-8 h-8" />
              ) : (
                <Globe
                  className="w-7 h-7"
                  style={{ color: 'var(--apple-text-muted)' }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1
                className="text-[22px] font-bold"
                style={{ color: 'var(--apple-text-primary)' }}
              >
                {domain}
              </h1>
              <p
                className="text-[12px] mt-1"
                style={{ color: 'var(--apple-text-secondary)' }}
              >
                {completedJobs.length} page
                {completedJobs.length !== 1 ? 's' : ''} indexed
              </p>
            </div>
            <a
              href={`${apiBase}/domains/rss/${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold apple-secondary-btn shrink-0"
            >
              <Rss className="w-3.5 h-3.5" />
              RSS
            </a>
          </div>
        </div>

        {/* Content hash timeline */}
        {timelineData?.timeline && timelineData.timeline.length > 0 && (
          <HashTimeline entries={timelineData.timeline} />
        )}

        {/* Active Jobs Liveline */}
        {activeJobs.length > 0 && (
          <div className="rounded-xl px-5 py-4 mb-4 apple-panel-soft overflow-hidden">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ color: 'var(--apple-text-muted)' }}
            >
              Active jobs
            </p>
            <div style={{ height: 200 }}>
              <Liveline
                data={livelineData}
                value={activeJobsValue}
                color="var(--apple-blue)"
                theme={theme}
                grid
                badge
                badgeVariant="minimal"
                showValue
                window={300}
                formatValue={(v) => `${Math.round(v)} job${v !== 1 ? 's' : ''}`}
              />
            </div>
          </div>
        )}

        {/* Pages */}
        <div className="px-5 py-4 mb-4 apple-panel-soft rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--apple-text-muted)' }}
            >
              Pages · {completedJobs.length}
            </p>
            {completedJobs.length > 0 && (
              <button
                onClick={handleChatAboutDomain}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold apple-secondary-btn"
              >
                <MessageSquare className="w-3 h-3" />
                Chat with all
              </button>
            )}
          </div>

          {completedJobs.length > 0 ? (
            <div className="flex flex-col gap-1">
              {completedJobs.map((job) => {
                const path = (() => {
                  try {
                    return new URL(job.url).pathname
                  } catch {
                    return ''
                  }
                })()
                const readerUrl = job.ultraReaderPath
                  ? `/browser/${job.id}/ultra`
                  : job.simpleReaderPath
                    ? `/browser/${job.id}/simple`
                    : `/jobs/${job.id}`
                return (
                  <div
                    key={job.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer apple-list-item"
                    onClick={() => navigate(readerUrl)}
                  >
                    {statusIcon(job.status)}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-medium truncate"
                        style={{ color: 'var(--apple-text-primary)' }}
                      >
                        {job.seoTitle || path || '/'}
                      </p>
                      <p
                        className="text-[10px] font-mono truncate"
                        style={{ color: 'var(--apple-text-muted)' }}
                      >
                        {path || '/'}
                      </p>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        background: 'var(--apple-bg-surface)',
                        color: 'var(--apple-text-secondary)',
                      }}
                    >
                      {job.mode}
                    </span>
                    <span
                      className="text-[10px] shrink-0"
                      style={{ color: 'var(--apple-text-muted)' }}
                    >
                      {timeAgo(job.createdAt)}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p
              className="text-[12px] text-center py-6"
              style={{ color: 'var(--apple-text-muted)' }}
            >
              No pages indexed yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DomainPage
