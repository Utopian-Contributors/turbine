import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useArchiveBatchViewsMutation, useCreateBatchJobsMutation, useCreateCollectionMutation, useParseFeedMutation } from '../../generated/graphql'

interface FeedItem {
  url: string
  title?: string
  description?: string
}

function getHostname(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}

function getPath(url: string): string {
  try {
    const p = new URL(url).pathname
    return p === '/' ? '' : p
  } catch { return '' }
}

const BatchPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const feedUrl = searchParams.get('feed') || ''

  const [parseFeed] = useParseFeedMutation()
  const [createBatch] = useCreateBatchJobsMutation()
  const [archiveBatch] = useArchiveBatchViewsMutation()
  const [createCollection] = useCreateCollectionMutation()

  const [items, setItems] = useState<FeedItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [jobs, setJobs] = useState<{ id: string; url: string; status: string }[]>([])
  const [mode, setMode] = useState<'SIMPLE' | 'ULTRA'>('SIMPLE')

  useEffect(() => {
    document.title = 'Tumbler | Batch'
  }, [])

  // Parse feed on mount
  useEffect(() => {
    if (!feedUrl) return
    setLoading(true)
    parseFeed({ variables: { url: feedUrl } })
      .then(({ data }) => {
        const found = (data?.parseFeed ?? []) as FeedItem[]
        setItems(found)
        setSelected(new Set(found.map((item) => item.url)))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [feedUrl, parseFeed])

  const toggleUrl = useCallback((url: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })
  }, [])

  const selectAll = useCallback(() => setSelected(new Set(items.map((item) => item.url))), [items])
  const selectNone = useCallback(() => setSelected(new Set()), [])

  const submitBatch = useCallback(async () => {
    setSubmitting(true)
    try {
      const { data } = await createBatch({
        variables: { urls: [...selected], mode: mode as never },
      })
      const createdJobs = data?.createBatchJobs ?? []
      setJobs(createdJobs)

      // Archive all created jobs and create a collection
      const userId = user?.id ?? null
      const walletAddress = user?.walletAddress ?? null
      if (userId && walletAddress && createdJobs.length > 0) {
        archiveBatch({
          variables: {
            userId,
            walletAddress,
            jobIds: createdJobs.map((j) => j.id),
            txSignature: 'batch-free',
          },
        }).catch(() => { /* best-effort */ })

        createCollection({
          variables: {
            userId,
            walletAddress,
            name: getHostname(feedUrl),
            urls: createdJobs.map((j) => j.url),
            jobIds: createdJobs.map((j) => j.id),
          },
        }).catch(() => { /* best-effort */ })
      }
    } finally {
      setSubmitting(false)
    }
  }, [selected, mode, createBatch, user, archiveBatch])

  const handleStart = useCallback(() => {
    if (selected.size === 0) return
    submitBatch()
  }, [selected, submitBatch])

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

        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--apple-text-muted)' }}>
          Batch
        </p>
        <p className="text-[15px] font-semibold mb-1" style={{ color: 'var(--apple-text-primary)' }}>
          {getHostname(feedUrl)}
        </p>
        <p className="text-[11px] font-mono truncate mb-6" style={{ color: '#30d158' }}>
          {feedUrl}
        </p>

        {/* Mode toggle */}
        <div className="flex gap-1 mb-4">
          {(['SIMPLE', 'ULTRA'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all"
              style={
                mode === m
                  ? { background: 'var(--apple-text-primary)', color: 'var(--apple-bg-surface)' }
                  : { background: 'var(--apple-bg-inactive)', color: 'var(--apple-text-muted)' }
              }
            >
              {m}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--apple-text-secondary)' }} />
          </div>
        )}

        {/* URL selection — before jobs are created */}
        {!loading && jobs.length === 0 && (
          <>
            {items.length > 0 && (
              <button
                className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 apple-primary-green mb-4"
                onClick={handleStart}
                disabled={selected.size === 0 || submitting}
                style={{ opacity: selected.size === 0 ? 0.5 : 1 }}
              >
                <span className="text-[13px] font-semibold">
                  {submitting ? 'Starting...' : `Crawl ${selected.size} page${selected.size !== 1 ? 's' : ''}`}
                </span>
              </button>
            )}

            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px]" style={{ color: 'var(--apple-text-secondary)' }}>
                {items.length} page{items.length !== 1 ? 's' : ''} found &middot; {selected.size} selected
              </p>
              <div className="flex gap-2">
                <button
                  className="text-[10px] font-semibold"
                  style={{ color: 'var(--apple-blue)' }}
                  onClick={selectAll}
                >
                  Select all
                </button>
                <button
                  className="text-[10px] font-semibold"
                  style={{ color: 'var(--apple-text-secondary)' }}
                  onClick={selectNone}
                >
                  None
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {items.map((item, i) => {
                const isSelected = selected.has(item.url)
                return (
                  <motion.button
                    key={item.url}
                    type="button"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="flex items-start gap-3 px-3 py-3 rounded-lg text-left w-full transition-colors"
                    style={{
                      background: isSelected ? 'rgba(0, 122, 255, .06)' : 'transparent',
                      border: '1px solid ' + (isSelected ? 'var(--apple-blue)' : 'var(--apple-border)'),
                    }}
                    onClick={() => toggleUrl(item.url)}
                  >
                    <span
                      className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center text-[8px] mt-0.5"
                      style={{
                        background: isSelected ? 'var(--apple-blue)' : 'var(--apple-bg-inactive)',
                        color: '#fff',
                      }}
                    >
                      {isSelected ? '✓' : ''}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-mono truncate" style={{ color: 'var(--apple-green)' }}>
                        {getHostname(item.url)}{getPath(item.url)}
                      </p>
                      {item.title && (
                        <p className="text-[13px] font-medium mt-1 leading-snug" style={{ color: 'var(--apple-text-primary)' }}>
                          {item.title}
                        </p>
                      )}
                      {item.description && (
                        <p
                          className="text-[11px] mt-1 leading-relaxed"
                          style={{
                            color: 'var(--apple-text-secondary)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {items.length === 0 && (
              <p className="text-center text-[13px] py-8" style={{ color: 'var(--apple-text-secondary)' }}>
                No pages found in this feed.
              </p>
            )}
          </>
        )}

        {/* Job status — after batch is started */}
        {jobs.length > 0 && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--apple-text-secondary)' }}>
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} queued
            </p>
            <div className="flex flex-col gap-1.5">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl cursor-pointer apple-list-item"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  {statusIcon(job.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-mono truncate" style={{ color: 'var(--apple-green)' }}>
                      {getHostname(job.url)}{getPath(job.url)}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--apple-text-secondary)' }}>
                      {job.status.toLowerCase()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default BatchPage
