import { useTheme } from '@/contexts/ThemeContext'
import { OptimizationMode, type OptimizationJob, type OptimizedFile } from '@/types/bandbot'
import { filesize } from 'filesize'
import {
  CheckCircle,
  Download,
  ExternalLink,
  Loader2,
  Tag,
  XCircle,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useOptimizationJobQuery } from '../../generated/graphql'


interface FileGroup {
  originalUrl: string
  filename: string
  originalSize: number
  category: string
  files: OptimizedFile[]
}

interface ActiveFileGroup extends FileGroup {
  activeFile: OptimizedFile
  modeLabel: string
}

interface ModeOption {
  key: OptimizationMode
  label: string
  description: string
  accent: string
}

type ThemeMode = 'light' | 'dark'

const LCD_PALETTE: Record<ThemeMode, {
  outerBackground: string
  outerBorder: string
  labelColor: string
  displayBackground: string
  displayColor: string
  displayBorder: string
  displayShadow: string
  shimmer: string
  badgeBackground: string
  badgeColor: string
}> = {
  light: {
    outerBackground: 'var(--apple-bg-surface)',
    outerBorder: 'var(--apple-border)',
    labelColor: 'var(--apple-text-secondary)',
    displayBackground: 'linear-gradient(180deg, #c8d5a8 0%, #b5c494 100%)',
    displayColor: '#2a3a1a',
    displayBorder: '#99a87a',
    displayShadow: 'inset 0 2px 4px rgba(0,0,0,.12), inset 0 -1px 0 rgba(255,255,255,.3)',
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.25) 50%, transparent 100%)',
    badgeBackground: 'var(--apple-bg-inactive)',
    badgeColor: 'var(--apple-text-primary)',
  },
  dark: {
    outerBackground: 'linear-gradient(180deg, #1d1d1b 0%, #151513 100%)',
    outerBorder: 'var(--apple-border)',
    labelColor: 'var(--apple-text-secondary)',
    displayBackground: 'linear-gradient(180deg, #1c2516 0%, #10140d 100%)',
    displayColor: '#c9f3b0',
    displayBorder: '#2f3d24',
    displayShadow: 'inset 0 2px 4px rgba(0,0,0,.45), inset 0 -1px 0 rgba(255,255,255,.04)',
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.10) 50%, transparent 100%)',
    badgeBackground: '#232822',
    badgeColor: '#d7e8cc',
  },
}

const FILE_CATEGORIES = [
  { key: 'images', label: 'Images', test: (ct: string) => ct.startsWith('image/') },
  { key: 'scripts', label: 'Scripts', test: (ct: string) => ct.includes('javascript') || ct.includes('ecmascript') },
  { key: 'styles', label: 'Stylesheets', test: (ct: string) => ct.includes('css') },
  { key: 'fonts', label: 'Fonts', test: (ct: string) => ct.includes('font') || ct.includes('woff') },
  { key: 'video', label: 'Video', test: (ct: string) => ct.startsWith('video/') },
  { key: 'audio', label: 'Audio', test: (ct: string) => ct.startsWith('audio/') },
  { key: 'other', label: 'Other', test: () => true },
]

const MODE_OPTIONS: ModeOption[] = [
  {
    key: OptimizationMode.SIMPLE,
    label: 'Simple',
    description: 'Colorful and aggressively compressed',
    accent: '#0071e3',
  },
  {
    key: OptimizationMode.ULTRA,
    label: 'Ultra',
    description: 'Binary, dithered, and stripped down',
    accent: '#1d1d1f',
  },
]

function categorize(contentType: string | null | undefined): string {
  if (!contentType) return 'other'
  const ct = contentType.split(';')[0].trim().toLowerCase()
  for (const cat of FILE_CATEGORIES) {
    if (cat.test(ct)) return cat.key
  }
  return 'other'
}

function extractFilename(url: string): string {
  try {
    const path = new URL(url).pathname
    const last = path.split('/').filter(Boolean).pop()
    return last || url
  } catch {
    return url.split('/').pop() || url
  }
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function compareOptimizedFiles(a: OptimizedFile, b: OptimizedFile): number {
  const sizeDiff = Number(a.optimizedSize) - Number(b.optimizedSize)
  if (sizeDiff !== 0) return sizeDiff
  return a.algorithm.localeCompare(b.algorithm)
}

function pickActiveVariant(files: OptimizedFile[], mode: OptimizationMode): { file: OptimizedFile | null; modeLabel: string } {
  if (files.length === 0) {
    return { file: null, modeLabel: 'Shared' }
  }

  const exactFamily = files.filter((file) => file.family.toUpperCase() === mode)
  if (exactFamily.length > 0) {
    const file = [...exactFamily].sort(compareOptimizedFiles)[0]
    return { file, modeLabel: mode === OptimizationMode.SIMPLE ? 'Simple' : 'Ultra' }
  }

  const bestVariant = files.filter((file) => file.isBestVariant)
  const pool = bestVariant.length > 0 ? bestVariant : files
  const file = [...pool].sort(compareOptimizedFiles)[0]
  return { file, modeLabel: 'Shared' }
}

function pageBytesLabel(bytes: number): string {
  return filesize(bytes)
}

const OptimizationJobPage: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { jobId } = useParams<{ jobId: string }>()
  const { data } = useOptimizationJobQuery({
    variables: { id: jobId! },
    skip: !jobId,
    pollInterval: 3000,
  })
  const [selectedMode, setSelectedMode] = useState<OptimizationMode>(OptimizationMode.SIMPLE)
  const job = data?.optimizationJob as OptimizationJob | undefined

  useEffect(() => {
    document.title = job ? `Tumbler | ${getHostname(job.url)}` : 'Tumbler'
  }, [job])

  useEffect(() => {
    if (job?.mode) {
      setSelectedMode(job.mode)
    }
  }, [job?.id, job?.mode])

  const fileGroups = useMemo((): FileGroup[] => {
    if (!job?.optimizedFiles) return []

    const map = new Map<string, FileGroup>()

    for (const file of job.optimizedFiles) {
      const existing = map.get(file.originalUrl)
      if (existing) {
        existing.files.push(file)
      } else {
        map.set(file.originalUrl, {
          originalUrl: file.originalUrl,
          filename: extractFilename(file.originalUrl),
          originalSize: Number(file.originalSize),
          category: categorize(file.contentType),
          files: [file],
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const categoryDiff = FILE_CATEGORIES.findIndex((cat) => cat.key === a.category) - FILE_CATEGORIES.findIndex((cat) => cat.key === b.category)
      if (categoryDiff !== 0) return categoryDiff
      return a.filename.localeCompare(b.filename)
    })
  }, [job?.optimizedFiles])

  const activeGroups = useMemo((): ActiveFileGroup[] => {
    return fileGroups
      .map((group) => {
        const { file, modeLabel } = pickActiveVariant(group.files, selectedMode)
        if (!file) return null
        return {
          ...group,
          activeFile: file,
          modeLabel,
        }
      })
      .filter((group): group is ActiveFileGroup => Boolean(group))
      .sort((a, b) => {
        const aSaved = a.originalSize - Number(a.activeFile.optimizedSize)
        const bSaved = b.originalSize - Number(b.activeFile.optimizedSize)
        if (bSaved !== aSaved) return bSaved - aSaved
        return a.filename.localeCompare(b.filename)
      })
  }, [fileGroups, selectedMode])


  const assetTotals = useMemo(() => {
    let original = 0
    let optimized = 0
    for (const group of activeGroups) {
      original += group.originalSize
      optimized += Number(group.activeFile.optimizedSize)
    }
    const saved = Math.max(0, original - optimized)
    const pct = original > 0 ? (saved / original) * 100 : 0
    return { original, optimized, saved, pct }
  }, [activeGroups])


  // Reader bandwidth: reader HTML file + only images (the only sources in the reader)
  const readerBandwidth = useMemo(() => {
    const readerSize = selectedMode === OptimizationMode.ULTRA
      ? Number(job?.ultraReaderSize ?? 0)
      : Number(job?.simpleReaderSize ?? 0)

    const imageGroups = activeGroups.filter((g) => g.category === 'images')
    let imageOptimized = 0
    for (const g of imageGroups) {
      imageOptimized += Number(g.activeFile.optimizedSize)
    }

    // Use the larger of reported page size vs sum of all original assets
    const reportedSize = Number(job?.originalPageSize ?? 0)
    const original = Math.max(reportedSize, assetTotals.original)
    const optimized = readerSize + imageOptimized
    const saved = Math.max(0, original - optimized)
    const pct = original > 0 ? (saved / original) * 100 : 0

    // Assets eliminated by reader (JS, CSS, fonts, etc.)
    const eliminatedGroups = activeGroups.filter((g) => g.category !== 'images')
    let eliminatedOriginal = 0
    for (const g of eliminatedGroups) {
      eliminatedOriginal += g.originalSize
    }

    return { readerSize, imageOptimized, original, optimized, saved, pct, eliminatedOriginal, eliminatedCount: eliminatedGroups.length }
  }, [job?.originalPageSize, job?.simpleReaderSize, job?.ultraReaderSize, activeGroups, selectedMode, assetTotals.original])

  const selectedModeOption = MODE_OPTIONS.find((option) => option.key === selectedMode) ?? MODE_OPTIONS[0]
  const activeCategories = FILE_CATEGORIES.filter((cat) => activeGroups.some((group) => group.category === cat.key))


  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return
      }
    } catch {
      // Fall through to the legacy copy path below.
    }

    const ta = document.createElement('textarea')
    ta.value = text
    ta.readOnly = true
    ta.setAttribute('aria-hidden', 'true')
    ta.style.cssText = 'position:fixed;opacity:0;left:-9999px;top:0;pointer-events:none'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    ta.setSelectionRange(0, ta.value.length)

    const copied = document.execCommand('copy')
    document.body.removeChild(ta)

    if (!copied) {
      throw new Error('Copy failed')
    }
  }, [])

  // Progress: PENDING=5%, PROCESSING=10-90% (based on file count, asymptotic), COMPLETED=100%
  const progressPct = useMemo(() => {
    if (!job) return 0
    if (job.status === 'COMPLETED') return 100
    if (job.status === 'FAILED') return 100
    if (job.status === 'PENDING') return 5
    const fileCount = job.optimizedFiles?.length ?? 0
    return Math.min(90, 10 + 80 * (1 - 1 / (1 + fileCount * 0.3)))
  }, [job])

  // Elapsed seconds timer for processing state
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!job || (job.status !== 'PENDING' && job.status !== 'PROCESSING')) return
    const start = new Date(job.createdAt).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [job])

  if (!job) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center apple-page">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--apple-text-secondary)' }} />
      </div>
    )
  }

  const isProcessing = job.status === 'PENDING' || job.status === 'PROCESSING'

  return (
    <div className="w-full min-h-screen apple-page">
      <style>{`@keyframes hash-shine{0%{background-position:200% 0}100%{background-position:-200% 0}}@keyframes bar-shine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
      <div className="max-w-3xl mx-auto px-5 pt-0 pb-16">
        {/* OG image hero */}
        {Boolean((job as unknown as Record<string, unknown>).seoOgImage) && (
          <motion.div
            className="-mx-5 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ maxHeight: 220 }}
          >
            <img
              src={(job as unknown as Record<string, unknown>).seoOgImage as string}
              alt={getHostname(job.url)}
              className="w-full object-cover object-top"
              style={{
                maxHeight: 220,
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              }}
              onError={(e) => {
                const compressed = (job as unknown as Record<string, unknown>).compressedPreviewImage as string | null
                if (compressed) {
                  (e.currentTarget as HTMLImageElement).src = compressed
                } else {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }
              }}
            />
          </motion.div>
        )}

        <div className="pt-6 mb-6">
          <div className="flex items-center gap-2.5">
            {Boolean((job as unknown as Record<string, unknown>).faviconPath) && (
              <img
                src={(job as unknown as Record<string, unknown>).faviconPath as string}
                alt=""
                className="w-5 h-5 rounded-sm shrink-0"
              />
            )}
            <p className="text-[15px] font-semibold" style={{ color: 'var(--apple-text-primary)' }}>
              {getHostname(job.url)}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {job.status === 'COMPLETED' && <CheckCircle className="w-3.5 h-3.5" style={{ color: '#30d158' }} />}
            {job.status === 'FAILED' && <XCircle className="w-3.5 h-3.5" style={{ color: '#ff453a' }} />}
            {isProcessing && job.contentHashSum ? (
              <span
                className="font-mono text-[11px] truncate cursor-pointer"
                onClick={() => copy(job.contentHashSum!)}
                style={{
                  background: 'linear-gradient(90deg, var(--apple-text-secondary) 0%, var(--apple-text-secondary) 40%, var(--apple-text-faint) 50%, var(--apple-text-secondary) 60%, var(--apple-text-secondary) 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'hash-shine 2s ease-in-out infinite',
                }}
              >
                {job.contentHashSum}
              </span>
            ) : job.contentHashSum ? (
              <span
                className="font-mono text-[11px] truncate cursor-pointer"
                onClick={() => copy(job.contentHashSum!)}
                style={{ color: 'var(--apple-text-secondary)' }}
              >
                {job.contentHashSum}
              </span>
            ) : (
              <span className="text-[11px]" style={{ color: 'var(--apple-text-secondary)' }}>
                {job.mode.toLowerCase()} &middot; {isProcessing ? `${elapsed}s` : new Date(job.createdAt).toLocaleString()}
              </span>
            )}
          </div>

          {/* Progress bar under domain */}
          {isProcessing && (
            <div className="mt-2 rounded-full overflow-hidden" style={{ height: 3, background: 'var(--apple-bg-inactive)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'var(--apple-text-secondary)',
                  borderRadius: 999,
                  transition: 'width 0.6s ease-out',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    animation: 'bar-shine 2s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl p-4 mb-4 apple-panel-soft">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--apple-text-secondary)' }}>
                Mode filter
              </p>
              <p className="text-[13px] font-semibold mt-1" style={{ color: 'var(--apple-text-primary)' }}>
                {selectedModeOption.label}
              </p>
            </div>
            <p className="text-[11px] text-right" style={{ color: 'var(--apple-text-secondary)' }}>
              {selectedModeOption.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MODE_OPTIONS.map((option) => {
              const active = option.key === selectedMode
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedMode(option.key)}
                  className="rounded-xl px-4 py-3 text-left"
                  style={
                    active
                      ? { background: option.accent, color: '#fff' }
                      : { background: 'var(--apple-bg-surface)', color: 'var(--apple-text-primary)', border: '1px solid var(--apple-border)' }
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] font-semibold">{option.label}</span>
                    {active && <span className="text-[9px] font-bold uppercase tracking-widest">active</span>}
                  </div>
                  <p className="mt-1 text-[11px]" style={active ? { color: 'rgba(255,255,255,0.85)' } : { color: 'var(--apple-text-secondary)' }}>
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence>
        {readerBandwidth.original > 0 && (
        <motion.div
          className="rounded-xl p-5 mb-4 apple-panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--apple-text-secondary)' }}>
                Bandwidth story
              </p>
              <p className="text-[18px] font-semibold mt-1" style={{ color: 'var(--apple-text-primary)' }}>
                Original site vs reader-ready page
              </p>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{ background: 'var(--apple-bg-inactive)', color: 'var(--apple-text-primary)' }}
            >
              {selectedMode.toLowerCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryTile label="Original site" value={pageBytesLabel(readerBandwidth.original)} helper="Full page weight" loading={false} theme={theme} />
            <SummaryTile
              label={`${selectedModeOption.label} reader`}
              value={pageBytesLabel(readerBandwidth.optimized)}
              helper={`Reader HTML + ${activeGroups.filter((g) => g.category === 'images').length} images`}
              loading={isProcessing}
              theme={theme}
            />
            <SummaryTile
              label="Bytes saved"
              value={pageBytesLabel(readerBandwidth.saved)}
              helper={readerBandwidth.original > 0 ? `${readerBandwidth.pct.toFixed(1)}% smaller` : 'Waiting for totals'}
              loading={isProcessing}
              theme={theme}
            />
          </div>

          {readerBandwidth.eliminatedCount > 0 && (
            <p className="text-[12px] mt-3" style={{ color: 'var(--apple-text-secondary)' }}>
              {readerBandwidth.eliminatedCount} asset{readerBandwidth.eliminatedCount !== 1 ? 's' : ''} eliminated by reader ({pageBytesLabel(readerBandwidth.eliminatedOriginal)} of scripts, styles, fonts removed).
            </p>
          )}
        </motion.div>
        )}
        </AnimatePresence>

        {activeGroups.length > 0 && (
          <div className="rounded-xl px-5 py-4 mb-4 apple-panel">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--apple-text-secondary)' }}>
              <span>{activeGroups.length} asset{activeGroups.length !== 1 ? 's' : ''} in {selectedMode.toLowerCase()}</span>
              <span>{pageBytesLabel(assetTotals.original)} &rarr; {pageBytesLabel(assetTotals.optimized)}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--apple-border)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, assetTotals.pct))}%`,
                  background: 'linear-gradient(90deg, #30d158, #2fb45a)',
                }}
              />
            </div>
            <p className="text-[12px] mt-2 font-bold" style={{ color: 'var(--apple-green)' }}>
              {assetTotals.pct.toFixed(1)}% saved &middot; {pageBytesLabel(assetTotals.saved)}
            </p>
          </div>
        )}

        {job.status === 'COMPLETED' && (
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl px-4 py-3 justify-center apple-secondary-btn"
              >
                <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--apple-text-primary)' }} />
                <span className="text-[12px] font-semibold">View page</span>
              </a>
              {job.simpleReaderPath && (
                <button
                  type="button"
                  onClick={() => navigate(`/browser/${job.id}/simple`)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 justify-center"
                  style={{ background: 'var(--apple-bg-surface)', color: 'var(--apple-text-primary)', border: '1px solid var(--apple-border)' }}
                >
                  <Download className="w-3.5 h-3.5" style={{ color: 'var(--apple-text-primary)' }} />
                  <span className="text-[12px] font-semibold">Simple Reader</span>
                </button>
              )}
              {job.ultraReaderPath && (
                <button
                  type="button"
                  onClick={() => navigate(`/browser/${job.id}/ultra`)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 justify-center apple-primary-green"
                >
                  <Download className="w-3.5 h-3.5" style={{ color: '#fff' }} />
                  <span className="text-[12px] font-semibold">Ultra Reader</span>
                </button>
              )}
            </div>
            {job.contentHashSum && (
              <button
                type="button"
                onClick={() => navigate(`/keywords/${job.id}`)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 justify-center mt-3 apple-secondary-btn"
              >
                <Tag className="w-3.5 h-3.5" />
                <span className="text-[12px] font-semibold">
                  Keywords
                </span>
              </button>
            )}
          </div>
        )}

        {activeGroups.length > 0 && activeCategories.map((cat, catIdx) => (
          <motion.div
            key={cat.key}
            className="-mx-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: catIdx * 0.1 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mx-3 mb-3" style={{ color: 'var(--apple-text-secondary)' }}>
              {cat.label}
            </p>

            <div className="flex flex-col gap-2">
              {activeGroups.filter((group) => group.category === cat.key).map((group, groupIdx) => (
                <motion.div
                  key={group.originalUrl}
                  className="cursor-pointer rounded-xl hover:bg-background/20 apple-list-item px-3 py-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: catIdx * 0.1 + groupIdx * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--apple-text-primary)' }}>
                        {group.filename}
                      </p>
                      <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--apple-text-secondary)' }}>
                        {group.originalUrl}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px]" style={{ color: 'var(--apple-text-secondary)' }}>
                        {pageBytesLabel(group.originalSize)}
                      </span>
                    </div>
                  </div>

                  <AssetRow
                    file={group.activeFile}
                    modeLabel={group.modeLabel}
                    theme={theme}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {job.status === 'COMPLETED' && activeGroups.length === 0 && (
          <div className="rounded-xl p-12 text-center apple-panel">
            <p style={{ color: 'var(--apple-text-secondary)' }}>No optimizable assets found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryTile({ label, value, helper, loading = false, theme }: { label: string; value: string; helper: string; loading?: boolean; theme: ThemeMode }) {
  // Extract numeric part for count-up animation
  const numMatch = value.match(/^([\d.]+)\s*(.*)$/)
  const targetNum = numMatch ? parseFloat(numMatch[1]) : 0
  const suffix = numMatch ? numMatch[2] : value

  const [displayNum, setDisplayNum] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (!numMatch || targetNum === prevTarget.current) return
    const start = prevTarget.current
    prevTarget.current = targetNum
    const duration = 600
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayNum(start + (targetNum - start) * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [numMatch, targetNum])

  const displayValue = numMatch
    ? (targetNum < 10 ? displayNum.toFixed(2) : displayNum.toFixed(targetNum % 1 === 0 ? 0 : 2)) + (suffix ? ' ' + suffix : '')
    : value

  return (
    <div className="rounded-xl px-4 py-3" style={{ background: LCD_PALETTE[theme].outerBackground, border: `1px solid ${LCD_PALETTE[theme].outerBorder}` }}>
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: LCD_PALETTE[theme].labelColor }}>
        {label}
      </p>
      <div
        className="mt-1.5 mb-1 rounded-lg px-3 py-2 font-mono text-[16px] font-bold tracking-wide"
        style={{
          background: LCD_PALETTE[theme].displayBackground,
          color: loading ? 'transparent' : LCD_PALETTE[theme].displayColor,
          border: `1px solid ${LCD_PALETTE[theme].displayBorder}`,
          boxShadow: LCD_PALETTE[theme].displayShadow,
          fontFamily: '"JetBrains Mono", "SF Mono", "Courier New", monospace',
          letterSpacing: '0.04em',
          textShadow: loading ? 'none' : theme === 'dark' ? '0 0 8px rgba(74, 222, 128, .18)' : '0 1px 0 rgba(255,255,255,.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {loading ? '---' : displayValue}
        {loading && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: LCD_PALETTE[theme].shimmer,
              animation: 'lcd-shimmer 1.5s ease-in-out infinite',
            }}
          />
        )}
        <style>{`@keyframes lcd-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
      </div>
      <p className="text-[10px] mt-1" style={{ color: 'var(--apple-text-secondary)' }}>
        {helper}
      </p>
    </div>
  )
}

function AssetRow({
  file,
  modeLabel,
  theme,
}: {
  file: OptimizedFile
  modeLabel: string
  theme: ThemeMode
}) {
  const optimizedSize = Number(file.optimizedSize)
  const savings = file.savings
  const badgeColor = modeLabel === 'Simple'
    ? '#0071e3'
    : modeLabel === 'Ultra'
      ? theme === 'dark'
        ? '#d7e8cc'
        : '#1d1d1f'
      : LCD_PALETTE[theme].badgeBackground

  return (
    <div
      className="rounded-lg py-2"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[9px] font-bold text-primary-foreground uppercase px-1.5 py-0.5 rounded"
          style={{ background: badgeColor }}
        >
          {modeLabel}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--apple-text-secondary)' }}>
          {pageBytesLabel(optimizedSize)}
        </span>
        <span className="text-[11px] font-bold" style={{ color: 'var(--apple-green)' }}>
          {savings.toFixed(1)}%
        </span>
        <div className="ml-auto flex items-center gap-2 min-w-0">
          <span
            className="text-[10px] font-mono truncate"
            style={{ color: 'var(--apple-text-muted)', userSelect: 'text' }}
            title={file.contentHash}
          >
            {file.contentHash}
          </span>
        </div>
      </div>

    </div>
  )
}

export default OptimizationJobPage