'use client'
import { cn } from '@/lib/utils'
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react'
import { motion } from 'motion/react'
import React, { createContext, useEffect, useState, type JSX } from 'react'
import { useInView } from 'react-intersection-observer'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }

interface CarouselProps {
  items: JSX.Element[]
  initialScroll?: number
  onEndReached?: () => void
}

type Card = {
  src: string
  title: string
  category: string
  content: React.ReactNode
  href?: string
}

const CarouselContext = createContext<{
  currentIndex: number
}>({
  currentIndex: 0,
})

export const Carousel = ({
  items,
  initialScroll = 0,
  onEndReached,
}: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [currentIndex] = useState(0)
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1 })

  console.debug(inView)

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
      checkScrollability()
    }
  }, [initialScroll])

  useEffect(() => {
    if (inView) onEndReached?.()
  }, [inView, onEndReached])

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <CarouselContext.Provider value={{ currentIndex }}>
      <div className="mb-8 -mx-8">
        <div className="flex items-center justify-between mb-2 px-8 mb-6">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--apple-text-muted)' }}
          >
            Discover
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.06) 100%), var(--apple-panel-bg, rgba(120,120,128,0.12))',
                border: '0.5px solid rgba(0,0,0,0.14)',
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.10), inset 0 0.5px 0 rgba(255,255,255,0.55)',
                cursor: canScrollLeft ? 'pointer' : 'default',
                opacity: canScrollLeft ? 1 : 0.28,
                transition: 'opacity 0.2s',
              }}
            >
              <IconArrowNarrowLeft
                style={{
                  width: 13,
                  height: 13,
                  color: 'var(--apple-text-secondary, #636366)',
                }}
              />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.06) 100%), var(--apple-panel-bg, rgba(120,120,128,0.12))',
                border: '0.5px solid rgba(0,0,0,0.14)',
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.10), inset 0 0.5px 0 rgba(255,255,255,0.55)',
                cursor: canScrollRight ? 'pointer' : 'default',
                opacity: canScrollRight ? 1 : 0.28,
                transition: 'opacity 0.2s',
              }}
            >
              <IconArrowNarrowRight
                style={{
                  width: 13,
                  height: 13,
                  color: 'var(--apple-text-secondary, #636366)',
                }}
              />
            </button>
          </div>
        </div>
        <div className="relative w-full">
          <div
            className="flex w-full overflow-x-scroll overflow-y-hidden overscroll-x-auto scroll-smooth [scrollbar-width:none]"
            ref={carouselRef}
            onScroll={checkScrollability}
          >
            <div
              className={cn(
                'absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l',
              )}
            ></div>

            <div
              className="flex flex-row justify-start gap-4 pl-4"
            >
              {items.map((item, index) => (
                <div
                  ref={index === items.length - 1 ? sentinelRef : undefined}
                  key={'card' + index}
                  className="rounded-3xl shrink-0"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

export const Card = ({
  card,
  layout = false,
}: {
  card: Card
  index: number
  layout?: boolean
}) => {
  return (
    <motion.button
      layoutId={layout ? `card-${card.title}` : undefined}
      onClick={() => card.href && window.open(card.href, '_blank')}
      className="cursor-pointer relative z-10 flex h-60 w-56 flex-col items-start justify-end overflow-hidden rounded-3xl bg-gray-100 md:w-96 dark:bg-neutral-900"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-[#e8e3d9]/40 via-[#e8e3d9]/85 to-[#e8e3d9] dark:from-black/30 dark:via-black/60 dark:to-black/80" />
      <div className="relative z-40 p-8">
        <motion.p
          layoutId={layout ? `category-${card.category}` : undefined}
          className="text-left font-sans text-sm font-medium text-black dark:text-white md:text-base"
        >
          {card.category}
        </motion.p>
        <motion.p
          layoutId={layout ? `title-${card.title}` : undefined}
          className="mt-2 max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] line-clamp-2 text-black dark:text-white"
        >
          {card.title}
        </motion.p>
      </div>
      <BlurImage
        src={card.src}
        alt={card.title}
        className="absolute inset-0 z-10 object-cover"
      />
    </motion.button>
  )
}

export const SkeletonCard = () => {
  return (
    <div style={{ width: 384, height: 240, flexShrink: 0, borderRadius: 24, background: 'red' }} />
  )
}

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true)
  return (
    <img
      className={cn(
        'h-full w-full transition-opacity duration-500',
        isLoading ? 'opacity-0' : 'opacity-100',
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ?? 'Background of a beautiful view'}
    />
  )
}
