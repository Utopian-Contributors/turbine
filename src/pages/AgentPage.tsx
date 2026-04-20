import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Identicon } from '@/components/ui/Identicon'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useAgentChat } from '@/hooks/useAgentChat'
import { gql, useQuery } from '@apollo/client'
import { toHeaderCase } from 'js-convert-case'
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Send,
  Trash2,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { codeToHtml } from 'shiki'
import {
  useAddJobToAgentSessionMutation,
  useAgentSessionQuery,
  useAgentSessionsQuery,
  useCreateAgentSessionMutation,
  useCreateOptimizationJobMutation,
  useDeleteAgentSessionMutation,
  useOptimizationJobQuery,
  useReaderIndexForLinksQuery,
  useReaderIndexForSessionQuery,
} from '../../generated/graphql'

const AGENT_MENTION_LOOKUP_QUERY = gql`
  query AgentMentionLookupInline(
    $query: String!
    $pagination: PaginationInput
  ) {
    readerIndex(query: $query, pagination: $pagination) {
      id
      url
      seoTitle
      seoDescription
      faviconPath
      simpleReaderPath
      ultraReaderPath
    }
  }
`

const UI_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const AGENT_CHAT_WHITE = '#e8e4de'
const AGENT_CHAT_PLACEHOLDERS = [
  'Use @ to search through archives',
  'Ask for links and images',
]
const SESSIONS_PAGE_SIZE = 20

const stripInjectedUserBlocks = (text: string): string =>
  text
    .replace(/\n?\n?\[ARTICLE\s+\d+:[\s\S]*?\[\/ARTICLE\]/g, '')
    .replace(
      /\n?\n?\[ATTACHED_ARCHIVE_LINKS\][\s\S]*?\[\/ATTACHED_ARCHIVE_LINKS\]/g,
      '',
    )
    .trim()

// ── Types ──

interface Session {
  id: string
  title: string | null
  promptHash?: string | null
  jobIds: string[]
  totalCost: number
  createdAt: string
}

interface TrackedJob {
  url: string
  jobId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
}

interface MentionResult {
  id: string
  url: string
  seoTitle?: string | null
  seoDescription?: string | null
  faviconPath?: string | null
  simpleReaderPath?: string | null
  ultraReaderPath?: string | null
}

interface LinkAttachment {
  id: string
  url: string
  title: string
  description: string | null
  faviconPath: string | null
}

interface SessionJob {
  id?: string
  url: string
  seoTitle?: string | null
  seoDescription?: string | null
  faviconPath?: string | null
  compressedPreviewImage?: string | null
}

type ThemeMode = 'light' | 'dark'

const AGENT_LCD_PALETTE: Record<
  ThemeMode,
  {
    housingBackground: string
    housingShadow: string
    bezelTop: string
    bezelBottom: string
    headerBackground: string
    headerBorder: string
    titleColor: string
    subtitleColor: string
    screenBackground: string
    screenShadow: string
    screenPrimaryText: string
    screenSecondaryText: string
    screenTertiaryText: string
    userBubbleBackground: string
    userBubbleBorder: string
    inputBackground: string
    inputBorder: string
    inputText: string
    inputPlaceholder: string
    sendButtonBackground: string
    sendButtonColor: string
  }
> = {
  light: {
    housingBackground: '#c7cbd2',
    housingShadow:
      '0 8px 24px rgba(34, 43, 58, 0.2), inset 0 2px 4px rgba(255,255,255,0.5)',
    bezelTop: 'linear-gradient(180deg, #eef1f5, #c7cbd2)',
    bezelBottom: 'linear-gradient(180deg, #c7cbd2, #aeb4bf)',
    headerBackground:
      'linear-gradient(rgb(245, 244, 241) 0%, rgb(236, 232, 225) 100%)',
    headerBorder: '#c2c7d0',
    titleColor: '#2d3440',
    subtitleColor: '#6f7785',
    screenBackground: 'linear-gradient(180deg, #f5f4f1 0%, #ece8e1 100%)',
    screenShadow:
      'inset 0 2px 4px rgba(0,0,0,.08), inset 0 -1px 0 rgba(255,255,255,.45)',
    screenPrimaryText: '#30353b',
    screenSecondaryText: '#616972',
    screenTertiaryText: '#7c858f',
    userBubbleBackground: 'rgba(76, 92, 120, 0.08)',
    userBubbleBorder: 'rgba(76, 92, 120, 0.16)',
    inputBackground:
      'linear-gradient(rgb(245, 244, 241) 0%, rgb(236, 232, 225) 100%)',
    inputBorder: '#bfc5d0',
    inputText: '#2d3440',
    inputPlaceholder: '#8b92a0',
    sendButtonBackground: 'linear-gradient(180deg, #8fca7f 0%, #6da95f 100%)',
    sendButtonColor: '#f4fff1',
  },
  dark: {
    housingBackground:
      'linear-gradient(rgb(42, 40, 38) 0%, rgb(30, 28, 26) 50%, rgb(26, 24, 22) 100%)',
    housingShadow:
      '0 4px 20px rgba(0,0,0,0.35), inset 0 2px 4px rgba(0,0,0,0.45)',
    bezelTop: 'linear-gradient(180deg, #1a1a18, #2a2a28)',
    bezelBottom: 'linear-gradient(180deg, #2a2a28, #1a1a18)',
    headerBackground: 'linear-gradient(180deg, #3a3a36 0%, #2e2e2a 100%)',
    headerBorder: '#1f1f1d',
    titleColor: AGENT_CHAT_WHITE,
    subtitleColor: AGENT_CHAT_WHITE,
    screenBackground:
      'linear-gradient(rgb(42, 40, 38) 0%, rgb(30, 28, 26) 50%, rgb(26, 24, 22) 100%)',
    screenShadow:
      'inset 0 2px 4px rgba(0,0,0,.35), inset 0 -1px 0 rgba(37, 23, 23, 0.04)',
    screenPrimaryText: AGENT_CHAT_WHITE,
    screenSecondaryText: AGENT_CHAT_WHITE,
    screenTertiaryText: AGENT_CHAT_WHITE,
    userBubbleBackground: 'rgba(232, 228, 222, 0.06)',
    userBubbleBorder: 'rgba(232, 228, 222, 0.14)',
    inputBackground: 'linear-gradient(180deg, #3a3a36 0%, #2e2e2a 100%)',
    inputBorder: '#1f1f1d',
    inputText: AGENT_CHAT_WHITE,
    inputPlaceholder: AGENT_CHAT_WHITE,
    sendButtonBackground: 'rgba(143, 196, 128, 0.18)',
    sendButtonColor: '#c9f3b0',
  },
}

// ── Helper: detect if URL is an image link ──

function isImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.svg',
      '.avif',
      '.bmp',
      '.ico',
    ]
    return imageExtensions.some((ext) => pathname.endsWith(ext))
  } catch {
    return false
  }
}

// ── Domain-grouped context files ──

function DomainGroups({ jobs }: { jobs: SessionJob[] }) {
  const [openDomain, setOpenDomain] = useState<string | null>(null)
  const [hoveredJob, setHoveredJob] = useState<SessionJob | null>(null)
  const { theme } = useTheme()
  const textPrimary = theme === 'dark' ? '#9ec89e' : '#1a2e1a'
  const textSecondary = theme === 'dark' ? '#6a9a6a' : '#3a4e3a'
  const textActive = theme === 'dark' ? '#c8e8c8' : '#0d1a0d'

  const groups = useMemo(() => {
    const map = new Map<
      string,
      { favicon: string | null; jobs: SessionJob[] }
    >()
    for (const job of jobs) {
      const host = getHostname(job.url)
      const existing = map.get(host)
      if (existing) {
        existing.jobs.push(job)
      } else {
        map.set(host, { favicon: job.faviconPath ?? null, jobs: [job] })
      }
    }
    return [...map.entries()]
  }, [jobs])

  const mono = UI_FONT

  // Collapsed domain pills
  if (!openDomain) {
    return (
      <div className="flex flex-wrap gap-1.5 pt-2 pb-0.5">
        {groups.map(([domain, { favicon, jobs: domainJobs }]) => (
          <button
            key={domain}
            type="button"
            onClick={() => {
              setOpenDomain(domain)
              setHoveredJob(domainJobs[0])
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded transition-colors shrink-0"
            style={{
              background: 'rgba(158, 200, 158, 0.08)',
              border: '1px solid rgba(158, 200, 158, 0.15)',
            }}
          >
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="w-3 h-3 rounded-sm shrink-0"
              />
            ) : (
              <img
                src="/utopian-icon.webp"
                alt=""
                className="w-3 h-3 rounded-sm shrink-0 opacity-60"
              />
            )}
            <span
              className="text-[9px] font-medium tracking-wide"
              style={{ color: textPrimary, fontFamily: mono }}
            >
              {domain}
            </span>
            <span
              className="text-[8px] tabular-nums"
              style={{ color: textSecondary, fontFamily: mono }}
            >
              {domainJobs.length}
            </span>
          </button>
        ))}
      </div>
    )
  }

  // Expanded: 2-column layout — links left, preview right
  const openGroup = groups.find(([d]) => d === openDomain)
  if (!openGroup) return null
  const [domain, { favicon, jobs: domainJobs }] = openGroup
  const preview = hoveredJob ?? domainJobs[0]

  return (
    <div className="pt-2 pb-0.5">
      {/* Back / domain header */}
      <button
        type="button"
        onClick={() => {
          setOpenDomain(null)
          setHoveredJob(null)
        }}
        className="flex items-center gap-1.5 px-2 py-1 rounded mb-2 transition-colors"
        style={{
          background: 'rgba(158, 200, 158, 0.15)',
          border: '1px solid rgba(158, 200, 158, 0.3)',
        }}
      >
        <span className="text-[7px]" style={{ color: textSecondary }}>
          ◀
        </span>
        {favicon ? (
          <img src={favicon} alt="" className="w-3 h-3 rounded-sm shrink-0" />
        ) : (
          <img
            src="/utopian-icon.webp"
            alt=""
            className="w-3 h-3 rounded-sm shrink-0 opacity-60"
          />
        )}
        <span
          className="text-[9px] font-medium tracking-wide"
          style={{ color: textPrimary, fontFamily: mono }}
        >
          {domain}
        </span>
        <span
          className="text-[8px] tabular-nums"
          style={{ color: textSecondary, fontFamily: mono }}
        >
          {domainJobs.length}
        </span>
      </button>

      {/* 2-column: links | preview */}
      <div className="flex gap-3" style={{ minHeight: 160 }}>
        {/* Left: link list */}
        <div
          className="flex flex-col gap-0.5 shrink-0 overflow-y-auto pr-1"
          style={{
            width: 180,
            maxHeight: 200,
            borderRight: '1px solid rgba(158, 200, 158, 0.12)',
          }}
        >
          {domainJobs.map((job) => {
            const jobKey = job.id ?? job.url
            const isActive = (preview?.id ?? preview?.url) === jobKey
            const href = job.id ? `/browser/${job.id}/ultra` : job.url
            return (
              <a
                key={jobKey}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredJob(job)}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded transition-colors"
                style={{
                  background: isActive
                    ? 'rgba(158, 200, 158, 0.15)'
                    : 'transparent',
                }}
              >
                <span
                  className="text-[9px] font-medium truncate tracking-wide"
                  style={{
                    color: isActive ? textActive : textPrimary,
                    fontFamily: mono,
                  }}
                >
                  {job.seoTitle || job.url}
                </span>
                <ExternalLink
                  className="w-2.5 h-2.5 shrink-0"
                  style={{ color: textSecondary }}
                />
              </a>
            )
          })}
        </div>

        {/* Right: preview card */}
        {preview && (
          <div className="flex-1 min-w-0 max-w-80 flex flex-col overflow-hidden">
            {isImageUrl(preview.url) ? (
              <img
                src={preview.url}
                alt=""
                className="w-full object-cover"
                style={{
                  height: 100,
                  borderBottom: '1px solid rgba(158, 200, 158, 0.1)',
                }}
              />
            ) : preview.compressedPreviewImage ? (
              <img
                src={preview.compressedPreviewImage}
                alt=""
                className="w-full object-cover"
                style={{
                  height: 100,
                  borderBottom: '1px solid rgba(158, 200, 158, 0.1)',
                }}
              />
            ) : (
              <div
                className="w-full flex items-center justify-center"
                style={{
                  height: 100,
                  background: 'rgba(158, 200, 158, 0.06)',
                  borderBottom: '1px solid rgba(158, 200, 158, 0.1)',
                }}
              >
                <img
                  src="/utopian-icon.webp"
                  alt=""
                  className="w-10 h-10 opacity-20"
                />
              </div>
            )}
            <div className="px-3 py-2 flex-1">
              <p
                className="text-[11px] font-muted font-bold leading-snug tracking-wide"
                style={{ color: textPrimary, fontFamily: mono }}
              >
                {preview.seoTitle || getHostname(preview.url)}
              </p>
              {preview.seoDescription && (
                <p
                  className="text-[9px] mt-1 leading-relaxed"
                  style={{
                    color: textSecondary,
                    fontFamily: mono,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {preview.seoDescription}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shiki code block ──

function ShikiCodeBlock({
  code,
  lang,
  themeMode,
}: {
  code: string
  lang: string
  themeMode: ThemeMode
}) {
  const [html, setHtml] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    let cancelled = false
    codeToHtml(code, {
      lang: lang || 'text',
      theme: themeMode === 'dark' ? 'github-dark' : 'github-light',
    })
      .then((result) => {
        if (!cancelled) setHtml(result)
      })
      .catch(() => {
        if (!cancelled) setHtml(null)
      })
    return () => {
      cancelled = true
    }
  }, [code, lang, themeMode])

  const label = lang && lang !== 'text' ? lang : 'code'
  const lineCount = code.split('\n').length

  const codeContent = html ? (
    <div
      className="text-[9px] leading-relaxed [&_pre]:!px-4 [&_pre]:!py-3 [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!rounded-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <pre
      className="px-4 py-3 text-[9px] leading-relaxed"
      style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#3a3632' }}
    >
      <code>{code}</code>
    </pre>
  )

  return (
    <div
      className="my-3 overflow-hidden"
      style={{
        background:
          themeMode === 'dark'
            ? 'linear-gradient(180deg, #1d232d 0%, #141a22 100%)'
            : 'linear-gradient(180deg, #f9f7f4 0%, #f0ece6 100%)',
        boxShadow:
          themeMode === 'dark'
            ? '0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center w-full px-3.5 py-2 cursor-pointer select-none"
        style={{
          background:
            themeMode === 'dark'
              ? 'linear-gradient(180deg, #242d39 0%, #1c2430 100%)'
              : 'linear-gradient(180deg, #efebe4 0%, #e4dfd7 100%)',
          borderBottom: collapsed
            ? 'none'
            : themeMode === 'dark'
              ? '1px solid #303948'
              : '1px solid #d8d1c7',
          boxShadow:
            themeMode === 'dark'
              ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
              : 'inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      >
        <span
          className="text-[8px] mr-2 transition-transform"
          style={{
            color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#b0aca4',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          }}
        >
          &#9660;
        </span>
        <span
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#b0aca4' }}
        >
          {label}
        </span>
        <span
          className="ml-auto text-[9px] tabular-nums"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#c8c4bc' }}
        >
          {lineCount} line{lineCount !== 1 ? 's' : ''}
        </span>
      </button>
      {!collapsed && <div className="overflow-x-auto">{codeContent}</div>}
    </div>
  )
}

// ── Helpers ──

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// ── URL to archive link resolver ──

function buildUrlMap(
  jobs: Array<{
    url: string
    id: string
    ultraReaderPath?: string | null
    simpleReaderPath?: string | null
  }> = [],
): Map<string, { archiveUrl: string; archiveViewer: string }> {
  const map = new Map<string, { archiveUrl: string; archiveViewer: string }>()

  for (const job of jobs) {
    try {
      const urlObj = new URL(job.url)
      const normalizedUrl = urlObj.toString()
      const viewerPath = job.ultraReaderPath ?? job.simpleReaderPath
      const archiveViewer = viewerPath
        ? `/browser/${job.id}/${job.ultraReaderPath ? 'ultra' : 'simple'}`
        : null

      if (archiveViewer) {
        map.set(normalizedUrl, {
          archiveUrl: job.url,
          archiveViewer,
        })
      }
    } catch {
      // Skip invalid URLs
    }
  }

  return map
}

// ── URL canonicalization for fuzzy matching ──
// Normalizes URLs to a single canonical form so agent-cited URLs (which may
// differ in protocol, www prefix, trailing slash, or fragment) match stored job URLs.
function canonicalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    u.protocol = 'https:' // agents often strip http→https or vice-versa
    u.hostname = u.hostname.replace(/^www\./, '') // agents often drop www
    u.pathname = u.pathname === '/' ? '/' : u.pathname.replace(/\/+$/, '') // normalize trailing slash
    u.hash = '' // fragments are never meaningful for identity
    u.search = '' // query params are rarely meaningful for identity
    return u.toString()
  } catch {
    return url
  }
}

function resolveLink(
  url: string,
  urlMap: Map<string, { archiveUrl: string; archiveViewer: string }>,
): {
  href: string
  isArchive: boolean
} {
  try {
    const urlObj = new URL(url)
    const normalizedUrl = urlObj.toString()
    const match = urlMap.get(normalizedUrl)
    if (match) {
      return { href: match.archiveViewer, isArchive: true }
    }
  } catch {
    // Fall through to return original URL
  }
  return { href: url, isArchive: false }
}

function truncateLinkDisplay(url: string, maxLen = 52): string {
  if (url.length <= maxLen) return url
  const head = url.slice(0, Math.max(20, Math.floor(maxLen * 0.55)))
  const tail = url.slice(-Math.max(10, Math.floor(maxLen * 0.2)))
  return `${head}...${tail}`
}

function LinkifiedText({
  text,
  jobs = [],
}: {
  text: string
  jobs?: Array<{
    url: string
    id: string
    ultraReaderPath?: string | null
    simpleReaderPath?: string | null
  }>
}) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const isUrlRegex = /^https?:\/\/[^\s]+$/
  const parts = text.split(urlRegex)
  const urlMap = buildUrlMap(jobs)

  return (
    <>
      {parts.map((part, idx) => {
        if (isUrlRegex.test(part)) {
          const cleanedUrl = part.replace(/[.,!?;:]+$/, '')
          const linkInfo = resolveLink(cleanedUrl, urlMap)
          const displayText = truncateLinkDisplay(cleanedUrl)
          return (
            <a
              key={`link-${idx}`}
              href={linkInfo.href}
              target={linkInfo.isArchive ? undefined : '_blank'}
              rel={linkInfo.isArchive ? undefined : 'noopener noreferrer'}
              className="underline inline-flex max-w-full align-bottom"
              style={{
                color: linkInfo.isArchive ? '#9ec89e' : '#6a9a6a',
                fontWeight: linkInfo.isArchive ? 600 : undefined,
              }}
              title={cleanedUrl}
            >
              <span className="truncate max-w-[320px]">{displayText}</span>
            </a>
          )
        }
        return <span key={`text-${idx}`}>{part}</span>
      })}
    </>
  )
}

function UserMessageContent({
  text,
  jobs = [],
}: {
  text: string
  jobs?: Array<{
    url: string
    id: string
    ultraReaderPath?: string | null
    simpleReaderPath?: string | null
  }>
}) {
  const mainText = text.trim()

  return <LinkifiedText text={mainText} jobs={jobs} />
}

// ── Job status tracker (polls a single job) ──

function JobStatusChip({
  jobId,
  onCompleted,
}: {
  jobId: string
  onCompleted: (jobId: string) => void
}) {
  const { data } = useOptimizationJobQuery({
    variables: { id: jobId },
    pollInterval: 3000,
  })
  const status = data?.optimizationJob?.status ?? 'PENDING'

  useEffect(() => {
    if (status === 'COMPLETED') onCompleted(jobId)
  }, [status, jobId, onCompleted])

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium ml-1"
      style={{
        color:
          status === 'COMPLETED'
            ? '#30d158'
            : status === 'FAILED'
              ? '#ff453a'
              : '#ff9f0a',
      }}
    >
      {status === 'COMPLETED' ? (
        <CheckCircle className="w-3 h-3" />
      ) : status === 'FAILED' ? (
        <span>failed</span>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin" />
      )}
      {status === 'COMPLETED'
        ? 'added'
        : status === 'FAILED'
          ? ''
          : 'scanning...'}
    </span>
  )
}

// ── Copy Button ──

const CopyButton: React.FC<{ text: string; palette: { screenTertiaryText: string } }> = ({ text, palette }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text])
  return (
    <button
      onClick={handleCopy}
      className="p-0.5 rounded transition-opacity hover:opacity-70"
      style={{ color: palette.screenTertiaryText }}
      title="Copy response"
    >
      {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

// ── Component ──

const AgentPage: React.FC = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const themeMode: ThemeMode = theme === 'dark' ? 'dark' : 'light'
  const lcdPalette = AGENT_LCD_PALETTE[themeMode]
  const navigate = useNavigate()
  const { sessionId } = useParams<{ sessionId?: string }>()
  const [searchParams] = useSearchParams()
  const preselectedJobs = useMemo(
    () => searchParams.get('jobs')?.split(',').filter(Boolean) ?? [],
    [searchParams],
  )

  const [input, setInput] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showAddSource, setShowAddSource] = useState(false)
  const [showSystemPrompt, setShowSystemPrompt] = useState(false)
  const [archiveSearch, setArchiveSearch] = useState('')
  const [debouncedArchiveSearch, setDebouncedArchiveSearch] = useState('')
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(
    new Set(preselectedJobs),
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)

  // Input history (up/down arrow)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [historyDraft, setHistoryDraft] = useState('')

  // Optimistic session title (set on first message before server responds)
  const [optimisticTitle, setOptimisticTitle] = useState<string | null>(null)

  // Jobs being tracked within this chat session
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([])
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionStart, setMentionStart] = useState<number | null>(null)
  const [mentionEnd, setMentionEnd] = useState<number | null>(null)
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState(0)
  const [linkAttachments, setLinkAttachments] = useState<LinkAttachment[]>([])
  const inputRef = useRef<HTMLDivElement>(null)

  // Queries
  const [loadingMoreSessions, setLoadingMoreSessions] = useState(false)
  const [hasMoreSessions, setHasMoreSessions] = useState(true)
  const { data: sessionsData, refetch: refetchSessions, fetchMore } =
    useAgentSessionsQuery({
      variables: {
        userId: user?.id ?? '',
        pagination: { take: SESSIONS_PAGE_SIZE, skip: 0 },
      },
      skip: !user?.id,
      notifyOnNetworkStatusChange: true,
    })

  const { data: sessionData, refetch: refetchSession } = useAgentSessionQuery({
    variables: { id: sessionId ?? '' },
    skip: !sessionId,
  })

  const { data: archiveData } = useReaderIndexForSessionQuery({
    variables: {
      query: debouncedArchiveSearch || undefined,
      pagination: { take: 50 },
    },
  })

  // When query looks like a domain hostname, fetch more results so we can offer
  // "add all pages from this domain" without under-counting.
  const isDomainQuery =
    !mentionQuery.includes(' ') && !mentionQuery.includes('/')
  const { data: mentionData, loading: mentionLoading } = useQuery(
    AGENT_MENTION_LOOKUP_QUERY,
    {
      variables: {
        query: mentionQuery,
        pagination: { take: isDomainQuery ? 50 : 8 },
      },
      skip: mentionQuery.trim().length === 0,
      fetchPolicy: 'cache-first',
    },
  )

  // Fetch all known archived pages for link substitution in agent responses
  const { data: linkIndexData } = useReaderIndexForLinksQuery({
    variables: { pagination: { take: 500 } },
    fetchPolicy: 'cache-and-network',
  })

  const [createSession] = useCreateAgentSessionMutation()
  const [deleteSession] = useDeleteAgentSessionMutation()
  const [createJob] = useCreateOptimizationJobMutation()
  const [addJobToSession] = useAddJobToAgentSessionMutation()

  // Chat hook
  const {
    messages,
    archiveLinks,
    streaming,
    error,
    sendMessage,
    loadMessages,
  } = useAgentChat(sessionId ?? null)

  // Agent model status
  const [agentStatus, setAgentStatus] = useState<{
    provider: string
    model: string
    available: boolean
    error?: string
  } | null>(null)
  useEffect(() => {
    const base =
      import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '').replace(
        '/graphql',
        '',
      ) || 'http://localhost:4000'
    fetch(`${base}/agent/status`)
      .then((r) => r.json())
      .then(setAgentStatus)
      .catch(() => null)
  }, [])

  const userMessageHistory = useMemo(() => {
    return messages
      .filter((m) => m.role === 'USER')
      .map((m) => stripInjectedUserBlocks(m.content))
      .filter((content) => content.length > 0)
  }, [messages])

  // Load messages when session data arrives
  useEffect(() => {
    if (sessionData?.agentSession?.messages) {
      loadMessages(
        sessionData.agentSession.messages.map(
          (m: { id: string; role: string; content: string; cost: number }) => ({
            id: m.id,
            role: m.role as 'USER' | 'ASSISTANT',
            content: m.content,
            cost: m.cost,
          }),
        ),
      )
    }
  }, [sessionData, loadMessages])

  // Reset state when switching sessions
  useEffect(() => {
    setTrackedJobs([])
    setOptimisticTitle(null)
    setLinkAttachments([])
  }, [sessionId])

  // Clear optimistic title once real title arrives
  useEffect(() => {
    if (sessionData?.agentSession?.title) setOptimisticTitle(null)
  }, [sessionData?.agentSession?.title])

  // Track whether user is near the bottom of the scroll container
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const threshold = 80
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }, [])

  // Auto-scroll only when near bottom
  useEffect(() => {
    if (isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, trackedJobs])

  // Immediately create a session when arriving with preselected jobs
  useEffect(() => {
    if (
      preselectedJobs.length === 0 ||
      sessionId ||
      !user?.id ||
      !user?.walletAddress
    )
      return
    createSession({
      variables: {
        userId: user.id,
        walletAddress: user.walletAddress,
        jobIds: preselectedJobs,
      },
    }).then(({ data }) => {
      if (data?.createAgentSession?.id) {
        refetchSessions()
        navigate(`/agent/${data.createAgentSession.id}`)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedJobs, sessionId])

  useEffect(() => {
    document.title = 'Utopian | Agent'
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % AGENT_CHAT_PLACEHOLDERS.length)
    }, 3000)
    return () => window.clearInterval(interval)
  }, [])

  const detectMention = useCallback((value: string, cursor: number) => {
    const beforeCursor = value.slice(0, cursor)
    const match = beforeCursor.match(/(?:^|\s)@([^\s@]{1,64})$/)
    if (!match) {
      setMentionQuery('')
      setMentionStart(null)
      setMentionEnd(null)
      return
    }
    const query = match[1]
    const start = cursor - query.length - 1
    setMentionQuery(query)
    setMentionStart(start)
    setMentionEnd(cursor)
  }, [])

  const mentionResults = useMemo(() => {
    const rows = (mentionData?.readerIndex ?? []) as MentionResult[]
    const deduped = new Map<string, MentionResult>()
    for (const row of rows) {
      if (!deduped.has(row.url)) deduped.set(row.url, row)
    }
    return [...deduped.values()]
  }, [mentionData])

  const mentionOpen =
    mentionQuery.trim().length > 0 &&
    mentionStart != null &&
    mentionEnd != null &&
    (mentionLoading || mentionResults.length > 0)

  useEffect(() => {
    setMentionSelectedIndex(0)
  }, [mentionQuery])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedArchiveSearch(archiveSearch), 300)
    return () => clearTimeout(t)
  }, [archiveSearch])

  const applyMention = useCallback(
    (item: MentionResult) => {
      if (mentionStart == null || mentionEnd == null) return
      const next = (
        input.slice(0, mentionStart) + input.slice(mentionEnd)
      ).trimStart()
      setInput(next)
      setMentionQuery('')
      setMentionStart(null)
      setMentionEnd(null)
      setMentionSelectedIndex(0)

      requestAnimationFrame(() => {
        const el = inputRef.current
        if (!el) return
        el.focus()
        // Set cursor position in contentEditable
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        let rem = mentionStart
        while (walker.nextNode()) {
          const node = walker.currentNode as Text
          if (rem <= node.length) {
            const range = document.createRange()
            range.setStart(node, rem)
            range.collapse(true)
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
            break
          }
          rem -= node.length
        }
      })

      setLinkAttachments((prev) => {
        if (prev.some((a) => a.id === item.id || a.url === item.url))
          return prev
        return [
          ...prev,
          {
            id: item.id,
            url: item.url,
            title: item.seoTitle || getHostname(item.url),
            description: item.seoDescription || null,
            faviconPath: item.faviconPath || null,
          },
        ]
      })
    },
    [input, mentionStart, mentionEnd],
  )

  const applyAllMentions = useCallback(
    (items: MentionResult[]) => {
      if (mentionStart == null || mentionEnd == null) return
      const next = (
        input.slice(0, mentionStart) + input.slice(mentionEnd)
      ).trimStart()
      setInput(next)
      setMentionQuery('')
      setMentionStart(null)
      setMentionEnd(null)
      setMentionSelectedIndex(0)

      requestAnimationFrame(() => inputRef.current?.focus())

      setLinkAttachments((prev) => {
        const existingUrls = new Set(prev.map((a) => a.url))
        const toAdd = items
          .filter((item) => !existingUrls.has(item.url))
          .map((item) => ({
            id: item.id,
            url: item.url,
            title: item.seoTitle || getHostname(item.url),
            description: item.seoDescription || null,
            faviconPath: item.faviconPath || null,
          }))
        return [...prev, ...toAdd]
      })
    },
    [input, mentionStart, mentionEnd],
  )

  // Unique domains across mention results. Each entry carries ALL pages for that
  // domain from linkIndexData (up to 500) so selecting a domain adds every page,
  // not just the subset visible in the dropdown.
  const domainEntries = useMemo(() => {
    const queryHosts = new Set(mentionResults.map((r) => getHostname(r.url)))
    if (queryHosts.size === 0) return []
    const allPages = linkIndexData?.readerIndex ?? []
    return [...queryHosts]
      .map((host) => ({
        host,
        pages: allPages.filter((p) => getHostname(p.url) === host),
      }))
      .filter((d) => d.pages.length > 0)
  }, [mentionResults, linkIndexData?.readerIndex])

  const handleAddSources = useCallback(async () => {
    if (!sessionId || selectedJobIds.size === 0) return
    await Promise.all(
      [...selectedJobIds].map((jobId) =>
        addJobToSession({ variables: { sessionId, jobId } }),
      ),
    )
    setShowAddSource(false)
    setSelectedJobIds(new Set())
    setArchiveSearch('')
    refetchSession()
  }, [sessionId, selectedJobIds, addJobToSession, refetchSession])

  const handleDeleteSession = useCallback(
    async (id: string) => {
      await deleteSession({ variables: { id } })
      refetchSessions()
      if (sessionId === id) navigate('/agent')
    },
    [deleteSession, refetchSessions, sessionId, navigate],
  )

  const handleSend = useCallback(() => {
    if (!input.trim() || !user?.id) return
    const text = input.trim()
    const jobIds = linkAttachments.map((a) => a.id)

    setHistoryIndex(-1)
    setHistoryDraft('')
    // Set title optimistically on first message
    if (messages.length === 0 && !sessionData?.agentSession?.title) {
      setOptimisticTitle(text.slice(0, 80))
    }
    sendMessage(
      user.id,
      text,
      text,
      jobIds.length > 0 ? jobIds : undefined,
      () => refetchSession(),
    )
    if (inputRef.current) inputRef.current.innerText = ''
    setInput('')
    setLinkAttachments([])
    setMentionQuery('')
    setMentionStart(null)
    setMentionEnd(null)
    setMentionSelectedIndex(0)
  }, [
    input,
    user,
    sendMessage,
    messages.length,
    sessionData,
    linkAttachments,
    refetchSession,
  ])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        mentionOpen &&
        (domainEntries.length > 0 || mentionResults.length > 0)
      ) {
        // Indices 0..domainEntries.length-1 = domain "add all" rows
        // Indices domainEntries.length.. = individual page results
        const total = domainEntries.length + mentionResults.length
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setMentionSelectedIndex((i) => (i + 1) % total)
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setMentionSelectedIndex((i) => (i - 1 + total) % total)
          return
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault()
          if (mentionSelectedIndex < domainEntries.length) {
            applyAllMentions(
              domainEntries[mentionSelectedIndex].pages as MentionResult[],
            )
          } else {
            const selected =
              mentionResults[mentionSelectedIndex - domainEntries.length]
            if (selected) applyMention(selected)
          }
          return
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          setMentionQuery('')
          setMentionStart(null)
          setMentionEnd(null)
          return
        }
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
        return
      }
      if (e.key === 'ArrowUp') {
        if (userMessageHistory.length === 0) return
        e.preventDefault()
        const next =
          historyIndex === -1
            ? userMessageHistory.length - 1
            : Math.max(0, historyIndex - 1)
        if (historyIndex === -1) setHistoryDraft(input)
        setHistoryIndex(next)
        setInput(userMessageHistory[next])
      } else if (e.key === 'ArrowDown') {
        if (userMessageHistory.length === 0) return
        e.preventDefault()
        if (historyIndex === -1) return
        const next = historyIndex + 1
        if (next >= userMessageHistory.length) {
          setHistoryIndex(-1)
          setInput(historyDraft)
        } else {
          setHistoryIndex(next)
          setInput(userMessageHistory[next])
        }
      }
    },
    [
      handleSend,
      historyIndex,
      historyDraft,
      input,
      mentionOpen,
      mentionResults,
      mentionSelectedIndex,
      applyMention,
      applyAllMentions,
      domainEntries,
      userMessageHistory,
    ],
  )

  // Create an optimization job for a URL from the chat
  const handleScanUrl = useCallback(
    async (url: string) => {
      if (!sessionId) return
      // Don't scan if already tracked or already in session
      const alreadyTracked = trackedJobs.some((j) => j.url === url)
      const alreadyInSession = sessionData?.agentSession?.jobs?.some(
        (j) => j.url === url,
      )
      if (alreadyTracked || alreadyInSession) return

      try {
        const { data } = await createJob({ variables: { url } })
        const jobId = data?.createOptimizationJob?.id
        if (jobId) {
          setTrackedJobs((prev) => [...prev, { url, jobId, status: 'PENDING' }])
        }
      } catch (err) {
        console.error('Failed to create job for', url, err)
      }
    },
    [sessionId, trackedJobs, sessionData, createJob],
  )

  // When a tracked job completes, add it to the session
  const handleJobCompleted = useCallback(
    async (jobId: string) => {
      if (!sessionId) return
      setTrackedJobs((prev) =>
        prev.map((j) =>
          j.jobId === jobId ? { ...j, status: 'COMPLETED' as const } : j,
        ),
      )
      try {
        await addJobToSession({ variables: { sessionId, jobId } })
        refetchSession()
      } catch (err) {
        console.error('Failed to add job to session:', err)
      }
    },
    [sessionId, addJobToSession, refetchSession],
  )

  const sessions = (sessionsData?.agentSessions ?? []) as Session[]

  useEffect(() => {
    if (!user?.id) {
      setHasMoreSessions(false)
      return
    }
    if (!sessionsData?.agentSessions) return
    const got = sessionsData.agentSessions.length
    if (got < SESSIONS_PAGE_SIZE) {
      setHasMoreSessions(false)
    }
  }, [user?.id, sessionsData?.agentSessions])

  const loadMoreSessions = useCallback(async () => {
    if (!user?.id || loadingMoreSessions || !hasMoreSessions) return

    setLoadingMoreSessions(true)
    try {
      const skip = sessions.length
      const { data } = await fetchMore({
        variables: {
          userId: user.id,
          pagination: { take: SESSIONS_PAGE_SIZE, skip },
        },
        updateQuery: (previous, { fetchMoreResult }) => {
          if (!fetchMoreResult?.agentSessions?.length) {
            return previous
          }

          const merged = [...previous.agentSessions]
          const existing = new Set(previous.agentSessions.map((s) => s.id))
          for (const next of fetchMoreResult.agentSessions) {
            if (!existing.has(next.id)) {
              merged.push(next)
            }
          }

          return {
            ...previous,
            agentSessions: merged,
          }
        },
      })

      const fetched = data?.agentSessions?.length ?? 0
      if (fetched < SESSIONS_PAGE_SIZE) {
        setHasMoreSessions(false)
      }
    } finally {
      setLoadingMoreSessions(false)
    }
  }, [user?.id, sessions.length, fetchMore, hasMoreSessions, loadingMoreSessions])
  const archives = useMemo(() => archiveData?.readerIndex ?? [], [archiveData])

  // Unique domains in the current modal results, with ALL their pages from linkIndexData
  const sessionModalDomains = useMemo(() => {
    const queryHosts = new Set(archives.map((a) => getHostname(a.url)))
    if (queryHosts.size === 0) return []
    const allPages = linkIndexData?.readerIndex ?? []
    return [...queryHosts]
      .map((host) => {
        const pages = allPages.filter((p) => getHostname(p.url) === host)
        const favicon =
          archives.find((a) => getHostname(a.url) === host && a.faviconPath)
            ?.faviconPath ?? null
        return { host, pages, favicon }
      })
      .filter((d) => d.pages.length > 0)
  }, [archives, linkIndexData?.readerIndex])
  const currentSession = sessionData?.agentSession
  const displayTitle =
    currentSession?.title || optimisticTitle || 'Untitled Session'

  const headerLinks = useMemo(() => {
    const deduped = new Map<string, SessionJob>()

    for (const job of currentSession?.jobs ?? []) {
      deduped.set(job.url, {
        id: job.id,
        url: job.url,
        seoTitle: job.seoTitle,
        seoDescription: job.seoDescription,
        faviconPath: job.faviconPath,
        compressedPreviewImage: job.compressedPreviewImage,
      })
    }

    if (
      deduped.size === 0 &&
      currentSession?.jobIds?.length &&
      linkIndexData?.readerIndex?.length
    ) {
      const byId = new Map(linkIndexData.readerIndex.map((job) => [job.id, job]))
      for (const jobId of currentSession.jobIds) {
        const job = byId.get(jobId)
        if (!job) continue
        deduped.set(job.url, {
          id: job.id,
          url: job.url,
          seoTitle: job.seoTitle,
          seoDescription: null,
          faviconPath: job.faviconPath,
          compressedPreviewImage: null,
        })
      }
    }

    return [...deduped.values()]
  }, [currentSession, linkIndexData?.readerIndex])

  const filteredArchives = archives

  // URLs already in the session (so we can mark them differently)
  const sessionUrls = useMemo(
    () => new Set((currentSession?.jobs ?? []).map((j) => j.url)),
    [currentSession],
  )
  const trackedUrls = useMemo(
    () => new Set(trackedJobs.map((j) => j.url)),
    [trackedJobs],
  )

  // Lookup map: URL → session job (for link previews)
  type SessionJobRecord = NonNullable<
    NonNullable<typeof currentSession>['jobs']
  >[number]
  // Lookup map: /browser/jobId/mode → job (for legacy /browser/ links in old messages)
  const sessionJobsByBrowserPath = useMemo(() => {
    const map = new Map<string, SessionJobRecord>()
    const allJobs = [
      ...(currentSession?.jobs ?? []),
      ...(linkIndexData?.readerIndex ?? []),
    ]
    for (const job of allJobs) {
      if (!job.id) continue
      map.set(`/browser/${job.id}/ultra`, job as SessionJobRecord)
      map.set(`/browser/${job.id}/simple`, job as SessionJobRecord)
    }
    return map
  }, [currentSession, linkIndexData?.readerIndex])

  // Lookup map: canonical URL → job, for all reader index + session jobs.
  // Used in markdownComponents.a to render reader links as favicon chips directly,
  // without any string substitution that can mangle existing markdown links.
  const readerUrlToJob = useMemo(() => {
    const map = new Map<string, SessionJobRecord>()
    const allJobs = [
      ...(linkIndexData?.readerIndex ?? []),
      ...archiveLinks, // backend-detected links from streamed responses
      ...(currentSession?.jobs ?? []), // session jobs override last
    ]
    for (const job of allJobs) {
      map.set(canonicalizeUrl(job.url), job as SessionJobRecord)
    }
    return map
  }, [currentSession, linkIndexData?.readerIndex, archiveLinks])

  // URL chip: renders a URL as a clickable link with hover preview
  const UrlChip: React.FC<{ href: string; children?: React.ReactNode }> =
    useCallback(
      ({ href, children }) => {
        const inSession = sessionUrls.has(href)
        const isTracked = trackedUrls.has(href)
        // Look up via canonicalized URL — covers www, https, trailing-slash variants
        const job = readerUrlToJob.get(canonicalizeUrl(href))

        const chip = (
          <button
            onClick={() => {
              if (job?.id) {
                window.open(
                  `/browser/${job.id}/${job.ultraReaderPath ? 'ultra' : 'simple'}`,
                  '_blank',
                )
              } else if (!isTracked) {
                handleScanUrl(href)
              }
            }}
            className="cursor-pointer inline-flex items-center gap-1 px-1 py-0 hover:underline rounded-md mx-0.5 text-[11px] font-medium transition-all"
            style={
              inSession
                ? { color: themeMode === 'dark' ? '#7bdc79' : '#28a745' }
                : isTracked
                  ? { color: '#ff9f0a' }
                  : { color: themeMode === 'dark' ? '#9ec89e' : '#6a9a6a' }
            }
          >
            <span className="truncate max-w-[200px]">
              {children ?? getHostname(href)}
            </span>
          </button>
        )

        // Wrap in tooltip with OG preview if we have job data
        if (job) {
          return (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>{chip}</TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={6}
                className="p-0 w-[280px] overflow-hidden"
                style={{
                  background: themeMode === 'dark' ? '#181f16' : '#fff',
                  borderRadius: 12,
                  border:
                    themeMode === 'dark'
                      ? '1px solid #2f3d24'
                      : '1px solid #e8e4de',
                  boxShadow:
                    themeMode === 'dark'
                      ? '0 8px 24px rgba(0,0,0,0.38)'
                      : '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                {job.compressedPreviewImage ? (
                  <img
                    src={job.compressedPreviewImage}
                    alt=""
                    className="w-full h-[140px] object-cover"
                    style={{
                      borderBottom:
                        themeMode === 'dark'
                          ? '1px solid #2f3d24'
                          : '1px solid #f0ece6',
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-[140px] flex items-center justify-center"
                    style={{
                      background: themeMode === 'dark' ? '#11170f' : '#f5f2ed',
                      borderBottom:
                        themeMode === 'dark'
                          ? '1px solid #2f3d24'
                          : '1px solid #f0ece6',
                    }}
                  >
                    <img
                      src="/utopian-icon.webp"
                      alt=""
                      className="w-12 h-12 opacity-40"
                    />
                  </div>
                )}
                <div className="px-3 py-2.5">
                  <p
                    className="text-[12px] font-semibold leading-snug"
                    style={{
                      color:
                        themeMode === 'dark' ? AGENT_CHAT_WHITE : '#1d1d1f',
                    }}
                  >
                    {job.seoTitle || getHostname(href)}
                  </p>
                  {job.seoDescription && (
                    <p
                      className="text-[10px] mt-1 leading-relaxed"
                      style={{
                        color:
                          themeMode === 'dark' ? AGENT_CHAT_WHITE : '#8e8a82',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {job.seoDescription}
                    </p>
                  )}
                  <p
                    className="text-[9px] font-mono mt-1.5 truncate"
                    style={{
                      color:
                        themeMode === 'dark' ? AGENT_CHAT_WHITE : '#b0aca4',
                    }}
                  >
                    {getHostname(href)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        }

        // No job data — show tooltip with fallback image
        return (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{chip}</TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={6}
              className="p-0 w-[280px] overflow-hidden"
              style={{
                background: themeMode === 'dark' ? '#181f16' : '#fff',
                borderRadius: 12,
                border:
                  themeMode === 'dark'
                    ? '1px solid #2f3d24'
                    : '1px solid #e8e4de',
                boxShadow:
                  themeMode === 'dark'
                    ? '0 8px 24px rgba(0,0,0,0.38)'
                    : '0 8px 24px rgba(0,0,0,0.12)',
              }}
            >
              <div className="px-3 py-2.5">
                <p
                  className="text-[12px] font-semibold leading-snug"
                  style={{
                    color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#1d1d1f',
                  }}
                >
                  {getHostname(href)}
                </p>
                <p
                  className="text-[9px] font-mono mt-1 truncate"
                  style={{
                    color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#b0aca4',
                  }}
                >
                  {href}
                </p>
                <p
                  className="text-[9px] mt-1.5"
                  style={{
                    color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#8e8a82',
                  }}
                >
                  {isTracked ? 'Scanning...' : 'Click to scan this page'}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        )
      },
      [sessionUrls, trackedUrls, readerUrlToJob, handleScanUrl, themeMode],
    )

  // Custom react-markdown components
  const markdownComponents = useMemo(
    () => ({
      a: ({
        href,
        children,
      }: {
        href?: string
        children?: React.ReactNode
      }) => {
        if (!href) return <>{children}</>
        if (href.startsWith('http')) {
          // If the URL is in the reader index, render as a favicon chip directly.
          const readerJob = readerUrlToJob.get(canonicalizeUrl(href))

          if (readerJob) {
            return (
              <a
                href={
                  readerJob.id
                    ? `/browser/${readerJob.id}/${readerJob.ultraReaderPath ? 'ultra' : 'simple'}`
                    : href
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md no-underline mx-0.5 transition-opacity hover:opacity-80"
                style={{
                  background:
                    themeMode === 'dark'
                      ? 'rgba(143, 196, 128, 0.12)'
                      : 'rgba(158, 200, 158, 0.1)',
                  border:
                    themeMode === 'dark'
                      ? '1px solid rgba(143, 196, 128, 0.2)'
                      : '1px solid rgba(158, 200, 158, 0.25)',
                  verticalAlign: 'middle',
                }}
              >
                {readerJob.faviconPath ? (
                  <img
                    src={readerJob.faviconPath}
                    alt=""
                    className="w-3 h-3 rounded-sm shrink-0"
                  />
                ) : (
                  <Globe
                    className="w-3 h-3 shrink-0"
                    style={{
                      color: themeMode === 'dark' ? '#9ec89e' : '#4a7a4a',
                    }}
                  />
                )}
                <span
                  className="text-[11px] font-medium truncate max-w-[240px]"
                  style={{
                    color: themeMode === 'dark' ? '#9ec89e' : '#2d5a2d',
                    fontFamily:
                      '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                  }}
                >
                  {readerJob.seoTitle ||
                    (() => {
                      try {
                        return new URL(href).hostname
                      } catch {
                        return href
                      }
                    })()}
                </span>
              </a>
            )
          }
          return <UrlChip href={href}>{children}</UrlChip>
        }
        // Legacy /browser/... links from old messages
        const job = sessionJobsByBrowserPath.get(href)
        if (job) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md no-underline mx-0.5 transition-opacity hover:opacity-80"
              style={{
                background:
                  themeMode === 'dark'
                    ? 'rgba(143, 196, 128, 0.12)'
                    : 'rgba(158, 200, 158, 0.1)',
                border:
                  themeMode === 'dark'
                    ? '1px solid rgba(143, 196, 128, 0.2)'
                    : '1px solid rgba(158, 200, 158, 0.25)',
                verticalAlign: 'middle',
              }}
            >
              {job.faviconPath ? (
                <img
                  src={job.faviconPath}
                  alt=""
                  className="w-3 h-3 rounded-sm shrink-0"
                />
              ) : (
                <Globe
                  className="w-3 h-3 shrink-0"
                  style={{
                    color: themeMode === 'dark' ? '#9ec89e' : '#4a7a4a',
                  }}
                />
              )}
              <span
                className="text-[11px] font-medium truncate max-w-[240px]"
                style={{
                  color: themeMode === 'dark' ? '#9ec89e' : '#2d5a2d',
                  fontFamily:
                    '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                }}
              >
                {job.seoTitle ||
                  (job.url
                    ? (() => {
                        try {
                          return new URL(job.url).hostname
                        } catch {
                          return job.url
                        }
                      })()
                    : String(children))}
              </span>
            </a>
          )
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: themeMode === 'dark' ? '#9ec89e' : '#6a9a6a' }}
          >
            {children}
          </a>
        )
      },
      img: ({ src, alt }: { src?: string; alt?: string }) => (
        <img
          src={src}
          alt={alt ?? ''}
          className="max-w-full rounded-lg my-2"
          style={{ maxHeight: 300 }}
        />
      ),
      pre: ({ children }: { children?: React.ReactNode }) => {
        // Extract lang and code text from the nested <code> element
        if (React.isValidElement(children) && children.props) {
          const props = children.props as {
            className?: string
            children?: React.ReactNode
          }
          const lang = (props.className ?? '').replace('language-', '')
          const code = String(props.children ?? '').replace(/\n$/, '')
          return (
            <ShikiCodeBlock code={code} lang={lang} themeMode={themeMode} />
          )
        }
        return (
          <pre
            className="rounded-lg px-4 py-3 my-2 overflow-x-auto text-[12px]"
            style={{
              background: themeMode === 'dark' ? '#11170f' : '#f8f6f2',
              color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#3a3632',
              border:
                themeMode === 'dark'
                  ? '1px solid #2f3d24'
                  : '1px solid #e8e4de',
            }}
          >
            {children}
          </pre>
        )
      },
      code: ({
        children,
        className,
      }: {
        children?: React.ReactNode
        className?: string
      }) => {
        // Inline code only — fenced blocks are handled by pre
        if (!className) {
          return (
            <code
              className="px-1 py-0.5 rounded text-[12px]"
              style={{
                background: themeMode === 'dark' ? '#1c2516' : '#f2f0eb',
                color: themeMode === 'dark' ? '#f0c0cb' : '#c7254e',
              }}
            >
              {children}
            </code>
          )
        }
        return <code className={className}>{children}</code>
      },
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1
          className="text-[17px] font-semibold mt-5 mb-2"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#1d1d1f' }}
        >
          {children}
        </h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2
          className="text-[15px] font-semibold mt-4 mb-1.5"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#1d1d1f' }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3
          className="text-[13px] font-semibold mt-3 mb-1"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#1d1d1f' }}
        >
          {children}
        </h3>
      ),
      p: ({ children }: { children?: React.ReactNode }) => (
        <p
          className="mb-2"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#3a3632' }}
        >
          {children}
        </p>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul
          className="my-1.5 ml-4 list-disc"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#3a3632' }}
        >
          {children}
        </ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol
          className="my-1.5 ml-4 list-decimal"
          style={{ color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#3a3632' }}
        >
          {children}
        </ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="mb-0.5">{children}</li>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote
          className="border-l-2 pl-3 my-2 italic"
          style={{
            borderColor: themeMode === 'dark' ? '#2f3d24' : '#d8d1c7',
            color: themeMode === 'dark' ? AGENT_CHAT_WHITE : '#8e8a82',
          }}
        >
          {children}
        </blockquote>
      ),
    }),
    [UrlChip, themeMode, sessionJobsByBrowserPath, readerUrlToJob],
  )

  // Render assistant message as markdown with raw HTML support and autolinks
  const renderAssistantContent = useCallback(
    (content: string) => (
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {content}
      </Markdown>
    ),
    [markdownComponents],
  )

  return (
    <div className="flex w-full h-screen apple-page">
      {/* Left panel — sessions (dark mode) */}
      <div
        className="w-64 shrink-0 flex flex-col"
        style={{
          background:
            themeMode === 'dark'
              ? 'linear-gradient(rgb(42, 40, 38) 0%, rgb(30, 28, 26) 50%, rgb(26, 24, 22) 100%)'
              : 'linear-gradient(rgb(245, 244, 241) 0%, rgb(236, 232, 225) 100%)',
          borderRight:
            themeMode === 'dark' ? '1px solid #333330' : '1px solid #d4d9e0',
          boxShadow:
            themeMode === 'dark'
              ? '1px 0 12px rgba(0,0,0,0.3)'
              : '1px 0 12px rgba(46, 54, 68, 0.12)',
        }}
      >
        <div className="p-4">
          <button
            onClick={() => navigate('/agent/new')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold transition-colors"
            style={{
              background:
                themeMode === 'dark'
                  ? 'linear-gradient(180deg, #3a3a36 0%, #2e2e2a 100%)'
                  : 'linear-gradient(rgb(245, 244, 241) 0%, rgb(236, 232, 225) 100%)',
              color: themeMode === 'dark' ? '#9ec89e' : '#2d3440',
              border:
                themeMode === 'dark'
                  ? '1px solid #4a4a44'
                  : '1px solid #cbd2dc',
              boxShadow:
                themeMode === 'dark'
                  ? '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)'
                  : '0 1px 3px rgba(58, 68, 84, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Session
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {sessions.map((s) => {
            const active = s.id === sessionId
            return (
              <div
                key={s.id}
                className="group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer mb-0.5 transition-colors"
                style={{
                  background: active
                    ? themeMode === 'dark'
                      ? 'linear-gradient(180deg, #3a3a36 0%, #2e2e2a 100%)'
                      : 'linear-gradient(rgb(245, 244, 241) 0%, rgb(236, 232, 225) 100%)'
                    : 'transparent',
                  boxShadow: active
                    ? themeMode === 'dark'
                      ? '0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)'
                      : '0 1px 4px rgba(58, 68, 84, 0.15), inset 0 1px 0 rgba(255,255,255,0.92)'
                    : undefined,
                  border: active
                    ? themeMode === 'dark'
                      ? '1px solid #4a4a44'
                      : '1px solid #cfd5df'
                    : '1px solid transparent',
                }}
                onClick={() => navigate(`/agent/${s.id}`)}
              >
                {s.promptHash ? (
                  <Identicon hash={s.promptHash} size={14} className="shrink-0 rounded-sm" />
                ) : (
                  <MessageSquare
                    className="w-3.5 h-3.5 shrink-0"
                    style={{
                      color: active
                        ? themeMode === 'dark'
                          ? '#9ec89e'
                          : '#6a9a6a'
                        : themeMode === 'dark'
                          ? '#7f8898'
                          : '#8b93a0',
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[12px] font-medium truncate"
                    style={{
                      color: active
                        ? themeMode === 'dark'
                          ? '#f1f4f8'
                          : '#2d3440'
                        : themeMode === 'dark'
                          ? '#bac2d0'
                          : '#6f7785',
                    }}
                  >
                    {active
                      ? s.title || optimisticTitle || 'Untitled'
                      : s.title || 'Untitled'}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{
                      color: active
                        ? themeMode === 'dark'
                          ? '#98a3b6'
                          : '#7a8391'
                        : themeMode === 'dark'
                          ? '#7f8898'
                          : '#9aa1ad',
                    }}
                  >
                    {s.totalCost} $UTCC
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteSession(s.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                  style={{
                    color: themeMode === 'dark' ? '#8a93a2' : '#8f97a4',
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel — chat */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen">
        {/* LCD screen housing */}
        <div
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
          style={{
            background: lcdPalette.housingBackground,
            boxShadow: lcdPalette.housingShadow,
          }}
        >
          {/* LCD bezel top edge */}
          <div
            style={{
              height: 3,
              background: lcdPalette.bezelTop,
            }}
          />

          {/* Header — etched into the bezel */}
          {currentSession && (
            <div
              className="px-5 py-3 flex items-start gap-3"
              style={{
                background: lcdPalette.headerBackground,
                borderBottom: `1px solid ${lcdPalette.headerBorder}`,
              }}
            >
              {/* Identicon avatar from system prompt hash */}
              {currentSession.promptHash && (
                <Identicon
                  hash={currentSession.promptHash}
                  size={32}
                  className="shrink-0 rounded-md mt-0.5"
                />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-bold tracking-wide"
                  style={{
                    color: lcdPalette.titleColor,
                    fontFamily:
                      '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                  }}
                >
                  {displayTitle}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p
                    className="text-[10px] tracking-wide"
                    style={{
                      color: lcdPalette.subtitleColor,
                      fontFamily:
                        '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                    }}
                  >
                    {headerLinks.length} link
                    {headerLinks.length !== 1 ? 's' : ''}
                  </p>
                  {currentSession.promptHash && (
                    <>
                      <span style={{ color: lcdPalette.subtitleColor, fontSize: 10 }}>&middot;</span>
                      <button
                        onClick={() => setShowSystemPrompt(true)}
                        className="text-[10px] font-mono tracking-wide hover:underline"
                        style={{ color: lcdPalette.subtitleColor }}
                        title="View system prompt"
                      >
                        {currentSession.promptHash.slice(0, 8)}
                      </button>
                    </>
                  )}
                </div>
                {headerLinks.length > 0 && <DomainGroups jobs={headerLinks} />}
              </div>
              <button
                onClick={() => {
                  setShowAddSource(true)
                  setSelectedJobIds(new Set())
                }}
                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                style={{
                  background:
                    themeMode === 'dark'
                      ? 'rgba(143,196,128,0.12)'
                      : 'rgba(0,0,0,0.05)',
                  color: lcdPalette.subtitleColor,
                  border:
                    themeMode === 'dark'
                      ? '1px solid rgba(143,196,128,0.2)'
                      : '1px solid rgba(0,0,0,0.1)',
                  fontFamily:
                    '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                }}
              >
                <Plus className="w-3 h-3" />
                Add source
              </button>
            </div>
          )}

          {/* System prompt viewer dialog */}
          <Dialog open={showSystemPrompt} onOpenChange={setShowSystemPrompt}>
            <DialogContent
              showCloseButton
              className="sm:max-w-[560px] gap-0 p-0 overflow-hidden border-0 shadow-2xl"
              style={{ background: themeMode === 'dark' ? '#1a1d16' : '#fff', borderRadius: 16 }}
            >
              <DialogTitle className="px-5 pt-4 pb-2 text-[14px] font-bold flex items-center gap-2.5" style={{ color: themeMode === 'dark' ? '#e8e6e0' : '#1d1d1f' }}>
                {currentSession?.promptHash && (
                  <Identicon hash={currentSession.promptHash} size={24} className="rounded-sm" />
                )}
                System Prompt
                {currentSession?.promptHash && (
                  <span className="text-[10px] font-mono font-normal ml-auto" style={{ color: themeMode === 'dark' ? '#7a7a6a' : '#a0a090' }}>
                    {currentSession.promptHash.slice(0, 12)}
                  </span>
                )}
              </DialogTitle>
              <div
                className="px-5 pb-5 overflow-y-auto prose prose-sm max-h-[60vh]"
                style={{
                  color: themeMode === 'dark' ? '#d0cec6' : '#3a3632',
                  fontSize: 13,
                }}
              >
                {currentSession?.systemPrompt ? (
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {currentSession.systemPrompt}
                  </Markdown>
                ) : (
                  <p style={{ color: themeMode === 'dark' ? '#7a7a6a' : '#a0a090' }}>
                    Using default system prompt.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* LCD screen surface — matches bandwidth story SummaryTile */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 flex overflow-y-auto px-5 py-5"
            style={{
              background: lcdPalette.screenBackground,
              boxShadow: lcdPalette.screenShadow,
            }}
          >
            <div className="max-w-2xl mx-auto w-full flex flex-col">
              {!sessionId && (
                <div className="flex-1 flex flex-col items-center justify-center py-12">
                  <MessageSquare
                    className="w-8 h-8 mb-3"
                    style={{ color: lcdPalette.screenSecondaryText }}
                  />
                  <p
                    className="text-[14px] font-bold tracking-wide"
                    style={{
                      color: lcdPalette.screenPrimaryText,
                      fontFamily:
                        '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                      textShadow: '0 1px 0 rgba(255,255,255,.2)',
                    }}
                  >
                    Select a session
                  </p>
                  <p
                    className="text-[11px] mt-1"
                    style={{
                      color: lcdPalette.screenSecondaryText,
                      fontFamily:
                        '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                      textShadow: '0 1px 0 rgba(255,255,255,.15)',
                    }}
                  >
                    Choose archived pages as context
                  </p>

                  <div
                    className="mt-4 w-full max-w-sm rounded-lg overflow-y-auto"
                    style={{
                      maxHeight: 240,
                      background:
                        themeMode === 'dark'
                          ? 'rgba(143, 196, 128, 0.06)'
                          : 'rgba(255,255,255,0.65)',
                      border:
                        themeMode === 'dark'
                          ? '1px solid rgba(143, 196, 128, 0.18)'
                          : '1px solid rgba(140, 160, 190, 0.2)',
                    }}
                    onScroll={(e) => {
                      const el = e.currentTarget
                      const nearBottom =
                        el.scrollHeight - el.scrollTop - el.clientHeight < 24
                      if (nearBottom) {
                        void loadMoreSessions()
                      }
                    }}
                  >
                    {sessions.length === 0 ? (
                      <p
                        className="px-3 py-2 text-[10px]"
                        style={{ color: lcdPalette.screenSecondaryText }}
                      >
                        No sessions yet.
                      </p>
                    ) : (
                      sessions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="w-full text-left px-3 py-2 border-b last:border-b-0"
                          style={{
                            borderColor:
                              themeMode === 'dark'
                                ? 'rgba(143, 196, 128, 0.1)'
                                : 'rgba(120, 130, 150, 0.15)',
                          }}
                          onClick={() => navigate(`/agent/${s.id}`)}
                        >
                          <p
                            className="text-[11px] font-semibold truncate"
                            style={{ color: lcdPalette.screenPrimaryText }}
                          >
                            {s.title || 'Untitled'}
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: lcdPalette.screenSecondaryText }}
                          >
                            {s.totalCost} $UTCC
                          </p>
                        </button>
                      ))
                    )}

                    {loadingMoreSessions && (
                      <div className="px-3 py-2 flex items-center gap-1.5">
                        <Loader2
                          className="w-3 h-3 animate-spin"
                          style={{ color: lcdPalette.screenSecondaryText }}
                        />
                        <span
                          className="text-[10px]"
                          style={{ color: lcdPalette.screenSecondaryText }}
                        >
                          Loading more sessions...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* New session modal is rendered outside the LCD screen */}

              {/* Chat messages */}
              {sessionId &&
                messages.map((msg) =>
                  msg.role === 'USER' ? (
                    <div key={msg.id} className="flex mb-3 justify-end">
                      <div
                        className="max-w-[80%] rounded-lg px-3 py-2 overflow-x-hidden"
                        style={{
                          background: lcdPalette.userBubbleBackground,
                          border: `1px solid ${lcdPalette.userBubbleBorder}`,
                        }}
                      >
                        <div
                          className="text-[12px] leading-relaxed whitespace-pre-wrap font-bold tracking-wide"
                          style={{
                            color: lcdPalette.screenPrimaryText,
                            textShadow: '0 1px 0 rgba(255,255,255,.2)',
                          }}
                        >
                          <UserMessageContent
                            text={msg.content}
                            jobs={sessionData?.agentSession?.jobs}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="pb-8 agent-response">
                      <div
                        className="text-[12.5px] leading-[1.75] tracking-wide"
                        style={{
                          color: lcdPalette.screenPrimaryText,
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                          textShadow: '0 1px 0 rgba(255,255,255,.2)',
                        }}
                      >
                        {renderAssistantContent(msg.content)}
                        {streaming &&
                          msg.id === messages[messages.length - 1]?.id && (
                            <span
                              className="lcd-cursor"
                              style={{ color: '#2a3a1a' }}
                            >
                              &#9608;
                            </span>
                          )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {msg.cost != null && msg.cost > 0 && (
                          <p
                            className="text-[9px] tracking-wide"
                            style={{
                              color: lcdPalette.screenTertiaryText,
                              fontFamily:
                                '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                              textShadow: '0 1px 0 rgba(255,255,255,.15)',
                            }}
                          >
                            {msg.cost} $UTCC
                          </p>
                        )}
                        <CopyButton text={msg.content} palette={lcdPalette} />
                      </div>
                    </div>
                  ),
                )}

              {/* Tracked jobs status */}
              {trackedJobs.filter((j) => j.status !== 'COMPLETED').length >
                0 && (
                <div className="flex flex-wrap gap-2 pb-8">
                  {trackedJobs
                    .filter((j) => j.status !== 'COMPLETED')
                    .map((j) => (
                      <div
                        key={j.jobId}
                        className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px]"
                        style={{
                          background:
                            themeMode === 'dark'
                              ? 'rgba(143, 196, 128, 0.08)'
                              : 'rgba(42, 58, 26, 0.08)',
                          border:
                            themeMode === 'dark'
                              ? '1px solid rgba(143, 196, 128, 0.14)'
                              : '1px solid rgba(42, 58, 26, 0.06)',
                          fontFamily:
                            '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                          color: lcdPalette.screenPrimaryText,
                          textShadow: '0 1px 0 rgba(255,255,255,.2)',
                        }}
                      >
                        <Globe
                          className="w-3 h-3"
                          style={{ color: lcdPalette.screenSecondaryText }}
                        />
                        <span className="font-medium truncate max-w-[140px]">
                          {getHostname(j.url)}
                        </span>
                        <JobStatusChip
                          jobId={j.jobId}
                          onCompleted={handleJobCompleted}
                        />
                      </div>
                    ))}
                </div>
              )}

              <style>{`@keyframes lcd-blink{0%,49%{opacity:1}50%,100%{opacity:0}}.lcd-cursor{animation:lcd-blink 1s step-end infinite;font-size:inherit;line-height:1}.agent-input-placeholder-dark:empty::before{content:attr(data-placeholder);color:#7ea86f;pointer-events:none}.agent-input-placeholder-light:empty::before{content:attr(data-placeholder);color:#6a9a6a;pointer-events:none}`}</style>

              {error && (
                <p
                  className="text-[10px] text-center py-2 font-bold"
                  style={{
                    color: themeMode === 'dark' ? '#ff9b8a' : '#6a3a2a',
                    fontFamily:
                      '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                    textShadow: '0 1px 0 rgba(255,255,255,.15)',
                  }}
                >
                  {error}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bar — recessed into LCD bezel */}
          {sessionId && (
            <div
              className="px-4 py-3 relative"
              style={{
                background: lcdPalette.inputBackground,
                borderTop: `1px solid ${lcdPalette.inputBorder}`,
              }}
            >
              <div
                className="max-w-lg mx-auto rounded-lg px-3 pt-2 pb-2"
                style={{
                  cursor: 'text',
                  background:
                    themeMode === 'dark'
                      ? 'rgba(143, 196, 128, 0.08)'
                      : 'rgba(158, 200, 158, 0.06)',
                  border:
                    themeMode === 'dark'
                      ? '1px solid rgba(143, 196, 128, 0.16)'
                      : '1px solid rgba(158, 200, 158, 0.12)',
                }}
                onClick={() => inputRef.current?.focus()}
              >
                {/* Row 1: contentEditable input */}
                <div
                  ref={inputRef}
                  contentEditable={!streaming}
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const el = e.currentTarget
                    const next = el.innerText
                    if (historyIndex !== -1) setHistoryIndex(-1)
                    setInput(next)
                    const sel = window.getSelection()
                    const cursor =
                      sel && sel.rangeCount > 0
                        ? (() => {
                            const r = sel.getRangeAt(0).cloneRange()
                            r.selectNodeContents(el)
                            r.setEnd(
                              sel.getRangeAt(0).endContainer,
                              sel.getRangeAt(0).endOffset,
                            )
                            return r.toString().length
                          })()
                        : next.length
                    detectMention(next, cursor)
                  }}
                  onKeyDown={handleInputKeyDown}
                  onPaste={(e) => {
                    e.preventDefault()
                    const text = e.clipboardData.getData('text/plain')
                    document.execCommand('insertText', false, text)
                  }}
                  data-placeholder={AGENT_CHAT_PLACEHOLDERS[placeholderIndex]}
                  style={{
                    color: lcdPalette.inputText,
                    fontFamily:
                      '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                    caretColor: lcdPalette.inputText,
                    outline: 'none',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    minHeight: '1.5em',
                  }}
                  className={`mb-2 ${themeMode === 'dark' ? 'agent-input-placeholder-dark' : 'agent-input-placeholder-light'}`}
                />
                {/* Row 2: attachments left, send button right */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                    {(() => {
                      const domainGroups = new Map<
                        string,
                        typeof linkAttachments
                      >()
                      for (const a of linkAttachments) {
                        const host = getHostname(a.url)
                        if (!domainGroups.has(host)) domainGroups.set(host, [])
                        domainGroups.get(host)!.push(a)
                      }
                      return [...domainGroups.entries()].map(
                        ([host, pages]) => {
                          const favicon =
                            pages.find((p) => p.faviconPath)?.faviconPath ??
                            null
                          return (
                            <div
                              key={host}
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                              style={{
                                background:
                                  themeMode === 'dark'
                                    ? 'rgba(143, 196, 128, 0.15)'
                                    : 'rgba(158, 200, 158, 0.18)',
                                border:
                                  themeMode === 'dark'
                                    ? '1px solid rgba(143, 196, 128, 0.25)'
                                    : '1px solid rgba(100, 160, 100, 0.3)',
                              }}
                            >
                              {favicon ? (
                                <img
                                  src={favicon}
                                  alt=""
                                  className="w-3 h-3 rounded-sm shrink-0"
                                />
                              ) : (
                                <Globe
                                  className="w-3 h-3 shrink-0"
                                  style={{ color: lcdPalette.inputText }}
                                />
                              )}
                              <span
                                className="text-[11px] max-w-[140px] truncate"
                                style={{
                                  color: lcdPalette.inputText,
                                  fontFamily:
                                    '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                                }}
                              >
                                {pages.length === 1
                                  ? pages[0].title || host
                                  : host}
                              </span>
                              {pages.length > 1 && (
                                <span
                                  className="text-[10px]"
                                  style={{
                                    color: lcdPalette.inputPlaceholder,
                                    fontFamily:
                                      '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                                  }}
                                >
                                  {pages.length}
                                </span>
                              )}
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  const ids = new Set(pages.map((p) => p.id))
                                  setLinkAttachments((prev) =>
                                    prev.filter((x) => !ids.has(x.id)),
                                  )
                                }}
                                className="ml-0.5 leading-none"
                                style={{ color: lcdPalette.inputPlaceholder }}
                              >
                                ×
                              </button>
                            </div>
                          )
                        },
                      )
                    })()}
                  </div>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    disabled={streaming}
                    className="p-1.5 rounded-md disabled:opacity-30 transition-colors shrink-0"
                    style={{
                      cursor: 'pointer',
                      background: lcdPalette.sendButtonBackground,
                      color: lcdPalette.sendButtonColor,
                      border:
                        themeMode === 'dark'
                          ? '1px solid rgba(143, 196, 128, 0.18)'
                          : '1px solid rgba(76, 125, 69, 0.65)',
                      boxShadow:
                        themeMode === 'dark'
                          ? 'none'
                          : '0 2px 8px rgba(76, 125, 69, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {mentionOpen && (
                <div
                  className="absolute max-h-80 bottom-full left-4 right-4 mb-2 rounded-lg overflow-y-auto"
                  style={{
                    border:
                      themeMode === 'dark'
                        ? '1px solid rgba(143, 196, 128, 0.25)'
                        : '1px solid #cfd5df',
                    background:
                      themeMode === 'dark'
                        ? 'rgba(16, 20, 13, 0.95)'
                        : '#f5f4f1',
                    boxShadow:
                      themeMode === 'dark'
                        ? undefined
                        : '0 4px 16px rgba(46, 54, 68, 0.12)',
                  }}
                >
                  <div
                    className="px-2 py-1 text-[10px]"
                    style={{
                      color: lcdPalette.inputPlaceholder,
                      borderBottom:
                        themeMode === 'dark'
                          ? '1px solid rgba(143, 196, 128, 0.18)'
                          : '1px solid #e2ddd8',
                      fontFamily:
                        '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                    }}
                  >
                    {mentionLoading
                      ? `Searching @${mentionQuery}...`
                      : `Links matching @${mentionQuery}`}
                  </div>
                  {!mentionLoading && mentionResults.length === 0 && (
                    <div
                      className="px-2 py-2 text-[11px]"
                      style={{
                        color: lcdPalette.inputText,
                        fontFamily:
                          '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                      }}
                    >
                      No matching links found.
                    </div>
                  )}
                  {domainEntries.map((entry, idx) => {
                    const favicon = (entry.pages as MentionResult[]).find(
                      (p) => p.faviconPath,
                    )?.faviconPath
                    return (
                      <button
                        key={entry.host}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          applyAllMentions(entry.pages as MentionResult[])
                        }}
                        className="w-full text-left px-2 py-2 flex items-center gap-2"
                        style={{
                          background:
                            mentionSelectedIndex === idx
                              ? themeMode === 'dark'
                                ? 'rgba(143, 196, 128, 0.22)'
                                : 'rgba(158, 200, 158, 0.16)'
                              : 'transparent',
                          color: lcdPalette.inputText,
                          borderBottom: `1px solid ${themeMode === 'dark' ? 'rgba(143,196,128,0.12)' : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        {favicon ? (
                          <img
                            src={favicon}
                            alt=""
                            className="w-3.5 h-3.5 rounded-sm shrink-0"
                          />
                        ) : (
                          <Globe
                            className="w-3.5 h-3.5 shrink-0"
                            style={{
                              color:
                                themeMode === 'dark' ? '#9ec89e' : '#5a8a5a',
                            }}
                          />
                        )}
                        <span
                          className="text-[11px] font-medium flex-1 truncate"
                          style={{
                            fontFamily:
                              '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                          }}
                        >
                          {entry.host}
                        </span>
                        <span
                          className="text-[10px] shrink-0"
                          style={{
                            color: lcdPalette.inputPlaceholder,
                            fontFamily:
                              '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                          }}
                        >
                          {entry.pages.length}{' '}
                          {entry.pages.length === 1 ? 'page' : 'pages'}
                        </span>
                      </button>
                    )
                  })}
                  {mentionResults.map((item, idx) => {
                    const activeIdx = domainEntries.length + idx
                    const active = activeIdx === mentionSelectedIndex
                    return (
                      <button
                        key={`${item.id}-${item.url}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          applyMention(item)
                        }}
                        className="w-full text-left px-2 py-2 flex items-center gap-2"
                        style={{
                          background: active
                            ? themeMode === 'dark'
                              ? 'rgba(143, 196, 128, 0.22)'
                              : 'rgba(158, 200, 158, 0.16)'
                            : 'transparent',
                          color: lcdPalette.inputText,
                        }}
                      >
                        {item.faviconPath ? (
                          <img
                            src={item.faviconPath}
                            alt=""
                            className="w-3.5 h-3.5 rounded-sm shrink-0"
                          />
                        ) : (
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span
                          className="text-[11px] truncate flex-1"
                          style={{
                            fontFamily:
                              '"JetBrains Mono", "SF Mono", "Courier New", monospace',
                          }}
                        >
                          {item.seoTitle || getHostname(item.url)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* LCD bezel bottom edge */}
          <div
            style={{
              height: 3,
              background: lcdPalette.bezelBottom,
            }}
          />
          {/* Model indicator */}
          {agentStatus && (
            <div
              className="flex items-center justify-center gap-1.5 py-1.5"
              style={{ opacity: 0.5 }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: agentStatus.available ? '#30d158' : '#ff453a',
                }}
              />
              <span
                className="text-[9px] font-medium"
                style={{
                  color: themeMode === 'dark' ? '#7a7a6a' : '#a0a090',
                  fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                }}
              >
                {agentStatus.model}
                <span className="text-black">{` ${toHeaderCase(
                  agentStatus.provider === 'local'
                    ? ' (local)'
                    : (agentStatus.provider ?? ''),
                )}`}</span>
              </span>
            </div>
          )}
        </div>
        {/* end LCD housing */}
      </div>
      {/* end right panel */}

      {/* Add source modal */}
      <Dialog
        open={showAddSource}
        onOpenChange={(v) => {
          if (!v) {
            setShowAddSource(false)
            setArchiveSearch('')
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[480px] gap-0 p-0 overflow-hidden border-0 shadow-2xl"
          style={{ background: '#ffffff', borderRadius: 20 }}
        >
          {/* Search bar */}
          <div className="px-5 pt-5 pb-3">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ background: '#f5f2ed', border: '1px solid #e8e4de' }}
            >
              <Search
                className="w-4 h-4 shrink-0"
                style={{ color: '#b0aca4' }}
              />
              <input
                type="text"
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                placeholder="Search by title, description, or URL..."
                className="flex-1 bg-transparent text-[13px] outline-none"
                style={{ color: '#1d1d1f' }}
                autoFocus
              />
              {archiveSearch && (
                <button
                  onClick={() => setArchiveSearch('')}
                  className="text-[11px] font-medium"
                  style={{ color: '#b0aca4' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="px-5 pb-2 overflow-y-auto" style={{ maxHeight: 360 }}>
            {filteredArchives.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {sessionModalDomains.map((entry) => {
                  const allSelected = entry.pages.every((p) =>
                    selectedJobIds.has(p.id),
                  )
                  return (
                    <button
                      key={entry.host}
                      type="button"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full transition-colors"
                      style={{
                        background: allSelected
                          ? 'rgba(0, 122, 255, 0.06)'
                          : 'transparent',
                        border: allSelected
                          ? '1px solid #007aff'
                          : '1px solid #e0dbd4',
                      }}
                      onClick={() => {
                        setSelectedJobIds((prev) => {
                          const next = new Set(prev)
                          if (allSelected) {
                            for (const p of entry.pages) next.delete(p.id)
                          } else {
                            for (const p of entry.pages) next.add(p.id)
                          }
                          return next
                        })
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center text-[8px]"
                        style={{
                          background: allSelected ? '#007aff' : '#e8e4de',
                          color: '#fff',
                        }}
                      >
                        {allSelected ? '✓' : ''}
                      </span>
                      <div
                        className="w-8 h-8 rounded-md shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: '#f5f2ed' }}
                      >
                        {entry.favicon ? (
                          <img
                            src={entry.favicon}
                            alt=""
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <Globe
                            className="w-4 h-4"
                            style={{ color: '#b0aca4' }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[12px] font-medium truncate"
                          style={{ color: '#1d1d1f' }}
                        >
                          {entry.host}
                        </p>
                        <p
                          className="text-[10px] truncate mt-0.5"
                          style={{ color: '#8e8a82' }}
                        >
                          {entry.pages.length} page
                          {entry.pages.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </button>
                  )
                })}
                {filteredArchives.map((a) => {
                  const isSelected = selectedJobIds.has(a.id)
                  const host = getHostname(a.url)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full transition-colors"
                      style={{
                        background: isSelected
                          ? 'rgba(0, 122, 255, 0.06)'
                          : 'transparent',
                        border: isSelected
                          ? '1px solid #007aff'
                          : '1px solid #f0ece6',
                      }}
                      onClick={() => {
                        setSelectedJobIds((prev) => {
                          const next = new Set(prev)
                          if (next.has(a.id)) next.delete(a.id)
                          else next.add(a.id)
                          return next
                        })
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center text-[8px]"
                        style={{
                          background: isSelected ? '#007aff' : '#e8e4de',
                          color: '#fff',
                        }}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      <div
                        className="w-8 h-8 rounded-md shrink-0 overflow-hidden"
                        style={{ background: '#f5f2ed' }}
                      >
                        <img
                          src={
                            a.compressedPreviewImage ||
                            a.faviconPath ||
                            '/utopian-icon.webp'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[12px] font-medium truncate"
                          style={{ color: '#1d1d1f' }}
                        >
                          {a.seoTitle || host}
                        </p>
                        {a.seoDescription && (
                          <p
                            className="text-[10px] truncate mt-0.5"
                            style={{ color: '#8e8a82' }}
                          >
                            {a.seoDescription}
                          </p>
                        )}
                        <p
                          className="text-[9px] font-mono truncate mt-0.5"
                          style={{ color: '#b0aca4' }}
                        >
                          {host}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : archiveSearch ? (
              <p
                className="text-[12px] text-center py-8"
                style={{ color: '#b0aca4' }}
              >
                No pages matching &ldquo;{archiveSearch}&rdquo;
              </p>
            ) : (
              <p
                className="text-[12px] text-center py-8"
                style={{ color: '#b0aca4' }}
              >
                No reader views yet.
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderTop: '1px solid #f0ece6' }}
          >
            <div className="flex items-center gap-3">
              <p className="text-[11px]" style={{ color: '#b0aca4' }}>
                {selectedJobIds.size} selected
              </p>
              {filteredArchives.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const filteredIds = new Set(
                      filteredArchives.map((a) => a.id),
                    )
                    const allSelected = filteredArchives.every((a) =>
                      selectedJobIds.has(a.id),
                    )
                    setSelectedJobIds((prev) => {
                      const next = new Set(prev)
                      if (allSelected) {
                        for (const id of filteredIds) next.delete(id)
                      } else {
                        for (const id of filteredIds) next.add(id)
                      }
                      return next
                    })
                  }}
                  className="text-[11px] font-medium"
                  style={{ color: '#007aff' }}
                >
                  {filteredArchives.every((a) => selectedJobIds.has(a.id))
                    ? 'Deselect all'
                    : 'Select all'}
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddSource(false)
                  setArchiveSearch('')
                }}
                className="px-4 py-2 rounded-lg text-[12px] font-medium"
                style={{ color: '#8e8a82' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSources}
                disabled={selectedJobIds.size === 0}
                className="px-5 py-2 rounded-xl text-[12px] font-semibold apple-primary-green disabled:opacity-40"
              >
                Add sources
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AgentPage
