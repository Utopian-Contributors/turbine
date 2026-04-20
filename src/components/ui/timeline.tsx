import React, { useMemo } from 'react'

interface TimelineProps {
  children?: React.ReactNode
}

function formatHour(h: number): string {
  if (h === 0) return '12a'
  if (h < 12) return `${h}a`
  if (h === 12) return '12p'
  return `${h - 12}p`
}

export const Timeline: React.FC<TimelineProps> = ({ children }) => {
  const ticks = useMemo(() => {
    const now = Date.now()
    const result: { pct: number; height: number; width: number; opacity: number; label?: string }[] = []

    // Start from the next 5-minute boundary after now
    const nowDate = new Date(now)
    const startMin = Math.ceil(nowDate.getMinutes() / 5) * 5
    const start = new Date(nowDate)
    start.setMinutes(startMin, 0, 0)
    if (start.getTime() < now) start.setMinutes(start.getMinutes() + 5)

    // Walk 5-minute steps across the full 24h window
    for (let offsetMin = 0; offsetMin <= 24 * 60; offsetMin += 5) {
      const tickTime = start.getTime() + offsetMin * 60_000
      const msUntil = tickTime - now
      if (msUntil < 0 || msUntil > 86_400_000) continue

      const pct = (1 - msUntil / 86_400_000) * 100
      const tickDate = new Date(tickTime)
      const minute = tickDate.getMinutes()
      const isHour = minute === 0
      const is30 = minute === 30
      const is15 = minute === 15 || minute === 45

      if (isHour) {
        result.push({
          pct,
          height: 10,
          width: 1,
          opacity: 0.5,
          label: formatHour(tickDate.getHours()),
        })
      } else if (is30) {
        result.push({ pct, height: 6, width: 0.5, opacity: 0.35 })
      } else if (is15) {
        result.push({ pct, height: 4, width: 0.5, opacity: 0.25 })
      } else {
        // Every 5 minutes — smallest tick
        result.push({ pct, height: 2.5, width: 0.5, opacity: 0.15 })
      }
    }

    return result
  }, [])

  return (
    <div className="relative" style={{ height: 56 }}>
      {/* Recessed groove */}
      <div
        className="absolute left-0 right-0 rounded-full"
        style={{
          top: 24,
          height: 4,
          background: 'var(--apple-border)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
        }}
      />

      {/* Clock ticks */}
      {ticks.map((tick, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${tick.pct}%`,
            top: 28 - tick.height,
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              width: tick.width,
              height: tick.height,
              background: 'var(--apple-text-muted)',
              opacity: tick.opacity,
            }}
          />
          {tick.label && (
            <span
              className="text-[7px] font-medium block text-center whitespace-nowrap"
              style={{
                color: 'var(--apple-text-muted)',
                marginTop: 1,
              }}
            >
              {tick.label}
            </span>
          )}
        </div>
      ))}

      {children}
    </div>
  )
}

interface TimelineBezelProps {
  children?: React.ReactNode
}

export const TimelineBezel: React.FC<TimelineBezelProps> = ({ children }) => {
  return (
    <div
      className="rounded-2xl p-[1px]"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.08) 100%)',
      }}
    >
      <div
        className="rounded-2xl px-5 pt-8 pb-3"
        style={{
          background: 'var(--apple-bg-surface)',
          boxShadow:
            '0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface TimelineMarkerProps {
  pct: number
  color: string
  lifted?: boolean
  overdue?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  pct,
  color,
  lifted = false,
  overdue = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${pct}%`,
        bottom: 32,
        transform: 'translateX(-50%)',
        zIndex: lifted ? 30 : 10,
      }}
    >
      <div
        className="cursor-pointer"
        style={{
          width: 2,
          height: 32,
          background: `${color}`,
          boxShadow: `0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)${overdue ? ', 0 0 8px rgba(255,149,0,0.35)' : ''}`,
          transform: lifted ? 'scale(1.4) translateY(-3px)' : 'scale(1)',
          transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </div>
  )
}

export const TimelineSeparator: React.FC = () => (
  <div
    className="mx-1 my-1"
    style={{
      height: 1,
      background:
        'linear-gradient(90deg, transparent, var(--apple-border) 20%, var(--apple-border) 80%, transparent)',
    }}
  />
)
