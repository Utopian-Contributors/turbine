import PaymentModal from '@/components/PaymentModal'
import { useAuth } from '@/contexts/AuthContext'
import {
  ArrowLeft,
  ExternalLink,
  Hash,
  Loader2,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  useExtractKeywordsMutation,
  useKeywordsForJobQuery,
  useOptimizationJobQuery,
} from '../../generated/graphql'

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const KeywordAuctionPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: jobData } = useOptimizationJobQuery({
    variables: { id: jobId! },
    skip: !jobId,
  })

  const {
    data: keywordData,
    refetch: refetchKeywords,
  } = useKeywordsForJobQuery({
    variables: { jobId: jobId ?? '' },
    skip: !jobId,
    pollInterval: 15000,
  })

  const [extractKeywords, { loading: extracting }] =
    useExtractKeywordsMutation()

  const [showPayment, setShowPayment] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string
    keyword: string
    frequency: number
    topBid: number | null
  } | null>(null)
  const [customBid, setCustomBid] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [expandedKeywordId, setExpandedKeywordId] = useState<string | null>(
    null,
  )

  const job = jobData?.optimizationJob ?? null
  const host = job ? getHostname(job.url) : ''
  const keywords = keywordData?.keywordsForJob ?? []

  useEffect(() => {
    document.title = 'Utopian | Keyword Auction'
  }, [])

  const handleExtract = useCallback(async () => {
    if (!jobId) return
    await extractKeywords({ variables: { jobId } })
    await refetchKeywords()
  }, [jobId, extractKeywords, refetchKeywords])

  const bidAmount = useMemo(() => {
    const parsed = parseInt(customBid, 10)
    if (Number.isFinite(parsed) && parsed > 0) return parsed
    return (selectedKeyword?.topBid ?? 0) + 1
  }, [customBid, selectedKeyword])

  const bidMemo = selectedKeyword
    ? `KW:${jobId}:${selectedKeyword.id}:${bidAmount}`
    : ''

  const handleBidConfirmed = useCallback(async () => {
    setShowPayment(false)
    setSubmitted(true)
    setSelectedKeyword(null)
    setCustomBid('')
    setTimeout(() => refetchKeywords(), 5000)
    setTimeout(() => refetchKeywords(), 15000)
    setTimeout(() => setSubmitted(false), 30000)
  }, [refetchKeywords])

  const userBids = useMemo(() => {
    if (!user?.walletAddress) return []
    return keywords.flatMap((kw) =>
      kw.bids
        .filter((b) => b.sender === user.walletAddress)
        .map((b) => ({ ...b, keywordText: kw.keyword })),
    )
  }, [keywords, user?.walletAddress])

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        {/* Back button */}
        <button
          className="flex items-center gap-1 text-[11px] font-medium mb-6"
          style={{ color: 'var(--apple-text-secondary)' }}
          onClick={() => navigate('/keywords')}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Keywords
        </button>

        {job && (
          <>
            {/* Page header */}
            <div className="flex items-start gap-4 mb-8">
              <div
                className="w-20 h-20 shrink-0 rounded-lg overflow-hidden"
                style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
              >
                <img
                  src={job.compressedPreviewImage || '/utopian-icon.webp'}
                  alt={job.seoTitle ?? host}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {job.faviconPath && (
                    <img
                      src={job.faviconPath}
                      alt=""
                      className="w-3.5 h-3.5 rounded-sm shrink-0"
                    />
                  )}
                  <p
                    className="text-[11px] font-mono"
                    style={{ color: 'var(--apple-text-muted)' }}
                  >
                    {host}
                  </p>
                </div>
                <h1
                  className="text-[18px] font-semibold mt-1 leading-snug"
                  style={{ color: 'var(--apple-text-primary)' }}
                >
                  {job.seoTitle || host}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#30d158', color: '#fff' }}
                  >
                    {keywords.length} keyword
                    {keywords.length !== 1 ? 's' : ''}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(48,209,88,0.1)',
                      color: '#30d158',
                    }}
                  >
                    {keywords.filter((k) => k.topBid).length} with bids
                  </span>
                </div>
              </div>
            </div>

            {/* Extract keywords CTA */}
            {keywords.length === 0 && (
              <div className="rounded-xl p-8 text-center apple-panel-soft mb-8">
                <Sparkles
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: 'var(--apple-text-faint)' }}
                />
                <p
                  className="text-[13px] font-medium mb-1"
                  style={{ color: 'var(--apple-text-primary)' }}
                >
                  No keywords extracted yet
                </p>
                <p
                  className="text-[11px] mb-4"
                  style={{ color: 'var(--apple-text-secondary)' }}
                >
                  Extract keywords from this page's content to start the auction
                </p>
                <button
                  onClick={handleExtract}
                  disabled={extracting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold"
                  style={{ background: '#30d158', color: '#fff' }}
                >
                  {extracting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Hash className="w-3.5 h-3.5" />
                  )}
                  Extract Keywords
                </button>
              </div>
            )}

            {/* Submitted notification */}
            {submitted && (
              <div
                className="flex items-center gap-2 justify-center py-3 rounded-xl text-[13px] font-medium mb-6"
                style={{
                  background: 'rgba(48,209,88,0.1)',
                  color: '#30d158',
                }}
              >
                <TrendingUp className="w-4 h-4" />
                Bid submitted — activates after on-chain confirmation
              </div>
            )}

            {/* Keywords list */}
            {keywords.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-1.5 mb-4">
                  <Hash
                    className="w-3.5 h-3.5"
                    style={{ color: 'var(--apple-text-muted)' }}
                  />
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--apple-text-muted)' }}
                  >
                    Keyword Auctions
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  {keywords.map((kw) => {
                    const isExpanded = expandedKeywordId === kw.id
                    const isSelected = selectedKeyword?.id === kw.id

                    return (
                      <div key={kw.id}>
                        <div
                          className="flex items-center gap-3 rounded-lg px-4 py-3 apple-panel-soft cursor-pointer transition-all"
                          style={{
                            border: isSelected
                              ? '1px solid #30d158'
                              : '1px solid transparent',
                          }}
                          onClick={() =>
                            setExpandedKeywordId(
                              isExpanded ? null : kw.id,
                            )
                          }
                        >
                          {/* Keyword name */}
                          <div className="flex-1 min-w-0">
                            <span
                              className="text-[13px] font-semibold"
                              style={{
                                color: 'var(--apple-text-primary)',
                              }}
                            >
                              #{kw.keyword}
                            </span>
                          </div>

                          {/* Frequency badge */}
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                            style={{
                              background: '#30d158',
                              color: '#fff',
                            }}
                          >
                            {kw.frequency}x
                          </span>

                          {/* Top bid */}
                          {kw.topBid ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className="text-[11px] font-bold"
                                style={{
                                  color: 'var(--apple-text-secondary)',
                                }}
                              >
                                {kw.topBid} $UTCC
                              </span>
                              <span
                                className="text-[9px] font-mono"
                                style={{
                                  color: 'var(--apple-text-muted)',
                                }}
                              >
                                {truncateAddress(kw.topBidder ?? '')}
                              </span>
                            </div>
                          ) : (
                            <span
                              className="text-[10px] shrink-0"
                              style={{
                                color: 'var(--apple-text-muted)',
                              }}
                            >
                              No bids
                            </span>
                          )}

                          {/* Bid button */}
                          {user && (
                            <button
                              className="shrink-0 px-3 py-1 rounded-lg text-[10px] font-semibold apple-secondary-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedKeyword({
                                  id: kw.id,
                                  keyword: kw.keyword,
                                  frequency: kw.frequency,
                                  topBid: kw.topBid ?? null,
                                })
                                setCustomBid('')
                              }}
                            >
                              Bid
                            </button>
                          )}
                        </div>

                        {/* Expanded: show all bids */}
                        {isExpanded && kw.bids.length > 0 && (
                          <div className="ml-4 mt-1 flex flex-col gap-1">
                            {kw.bids.map((bid) => (
                              <div
                                key={bid.id}
                                className="flex items-center justify-between rounded-lg px-3 py-2 apple-panel-soft"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{
                                      background: bid.active
                                        ? '#30d158'
                                        : 'var(--apple-text-muted)',
                                    }}
                                  />
                                  <span
                                    className="text-[10px] font-mono"
                                    style={{
                                      color:
                                        'var(--apple-text-primary)',
                                    }}
                                  >
                                    {truncateAddress(bid.sender)}
                                  </span>
                                  {bid.active && (
                                    <span
                                      className="text-[8px] font-bold uppercase px-1 py-0.5 rounded"
                                      style={{
                                        background: '#30d158',
                                        color: '#fff',
                                      }}
                                    >
                                      Winner
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-[10px] font-bold"
                                    style={{
                                      color:
                                        'var(--apple-text-secondary)',
                                    }}
                                  >
                                    {bid.amount} $UTCC
                                  </span>
                                  <a
                                    href={`https://solscan.io/tx/${bid.txSignature}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink
                                      className="w-2.5 h-2.5"
                                      style={{
                                        color: 'var(--apple-blue)',
                                      }}
                                    />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Bid panel (when keyword selected) */}
            {selectedKeyword && user && (
              <div
                className="sticky bottom-4 z-50 rounded-xl px-5 py-4 apple-panel-soft"
                style={{
                  background: 'var(--apple-bg-elevated)',
                  borderTop: '1px solid var(--apple-border)',
                  boxShadow: '0 -4px 16px rgba(0,0,0,0.10)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p
                      className="text-[13px] font-semibold"
                      style={{ color: 'var(--apple-text-primary)' }}
                    >
                      #{selectedKeyword.keyword}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: 'var(--apple-text-muted)' }}
                    >
                      {selectedKeyword.frequency} mentions
                      {selectedKeyword.topBid
                        ? ` · Current top bid: ${selectedKeyword.topBid} $UTCC`
                        : ' · No bids yet'}
                    </p>
                  </div>
                  <button
                    className="text-[10px] font-medium"
                    style={{ color: 'var(--apple-text-secondary)' }}
                    onClick={() => setSelectedKeyword(null)}
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    className="text-[11px] font-semibold"
                    style={{ color: 'var(--apple-text-secondary)' }}
                  >
                    Your bid:
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder={String(
                      (selectedKeyword.topBid ?? 0) + 1,
                    )}
                    value={customBid}
                    onChange={(e) => setCustomBid(e.target.value)}
                    className="flex-1 bg-transparent border rounded-lg px-3 py-1.5 text-[12px] font-mono outline-none"
                    style={{
                      borderColor: 'var(--apple-border)',
                      color: 'var(--apple-text-primary)',
                    }}
                  />
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: 'var(--apple-text-secondary)' }}
                  >
                    $UTCC
                  </span>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold"
                    style={{ background: '#30d158', color: '#fff' }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Place Bid
                  </button>
                </div>
              </div>
            )}

            {/* My bids section */}
            {userBids.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-1.5 mb-4">
                  <TrendingUp
                    className="w-3.5 h-3.5"
                    style={{ color: 'var(--apple-text-muted)' }}
                  />
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--apple-text-muted)' }}
                  >
                    My Bids
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  {userBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between rounded-lg px-4 py-3 apple-panel-soft"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: bid.active
                              ? '#30d158'
                              : 'var(--apple-text-muted)',
                          }}
                        />
                        <span
                          className="text-[12px] font-semibold"
                          style={{
                            color: 'var(--apple-text-primary)',
                          }}
                        >
                          #{bid.keywordText}
                        </span>
                        {bid.active && (
                          <span
                            className="text-[8px] font-bold uppercase px-1 py-0.5 rounded"
                            style={{
                              background: '#30d158',
                              color: '#fff',
                            }}
                          >
                            Winning
                          </span>
                        )}
                      </div>
                      <span
                        className="text-[11px] font-bold"
                        style={{
                          color: 'var(--apple-text-secondary)',
                        }}
                      >
                        {bid.amount} $UTCC
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!job && jobId && (
          <div className="rounded-xl p-10 text-center apple-panel-soft">
            <p
              className="text-[13px]"
              style={{ color: 'var(--apple-text-secondary)' }}
            >
              Loading page details...
            </p>
          </div>
        )}

        {/* Payment modal */}
        <PaymentModal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          onConfirmed={handleBidConfirmed}
          amount={String(bidAmount)}
          memo={bidMemo}
          title="Keyword Bid"
          description={`Bid ${bidAmount} $UTCC on #${selectedKeyword?.keyword ?? ''} (${selectedKeyword?.frequency ?? 0} mentions)`}
          publicDataNotice
        />
      </div>
    </div>
  )
}

export default KeywordAuctionPage
