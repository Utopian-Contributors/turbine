import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toHeaderCase } from 'js-convert-case'
import { Check, Copy, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { WebsiteRatingQuery } from '../../generated/graphql'

type RatingFromQuery = NonNullable<
  NonNullable<WebsiteRatingQuery['website']>['ratings']
>[number]

interface GenerateImprovementsDialogProps {
  rating: RatingFromQuery
  meta: Record<string, string>
}

export function GenerateImprovementsDialog({
  rating,
  meta,
}: GenerateImprovementsDialogProps) {
  const [copied, setCopied] = useState(false)

  const prompt = useMemo(() => {
    const sections: string[] = []

    sections.push(`Help me fix the following issues found on ${rating.url}`)

    // Security
    const security: string[] = []
    if (!rating.httpsSupport) {
      security.push(
        'Missing HTTPS support - the site needs a valid SSL certificate',
      )
    }
    if (!rating.noMixedContent) {
      security.push(
        'Mixed content detected - some resources are loaded over HTTP instead of HTTPS',
      )
    }
    if (security.length > 0) {
      sections.push(`\nSecurity:\n${security.join('\n')}`)
    }

    // Metadata
    const metadata: string[] = []
    if (!rating.hasFavicon) metadata.push('Missing favicon')
    if (!rating.hasDescription) metadata.push('Missing description meta tag')
    if (!rating.hasOgImage)
      metadata.push('Missing og:image meta tag for social sharing')
    if (!meta['og:title']) metadata.push('Missing og:title meta tag')
    if (!meta['og:description'])
      metadata.push('Missing og:description meta tag')
    if (!meta['twitter:card']) metadata.push('Missing twitter:card meta tag')
    if (metadata.length > 0) {
      sections.push(`\nMetadata:\n${metadata.join('\n')}`)
    }

    // Accessibility
    if (rating.accessibility.length > 0) {
      const a11y = rating.accessibility.map(
        (v) =>
          `${toHeaderCase(v.violationId)} (${v.impact} impact): ${v.description}\nMore info: ${v.helpUrl}`,
      )
      sections.push(`\nAccessibility:\n${a11y.join('\n\n')}`)
    }

    // Performance
    const perf: string[] = []
    if (rating.stableLoadTime && rating.stableLoadTime > 3000) {
      perf.push(
        `WiFi load time is ${rating.stableLoadTime}ms (should be under 3000ms)`,
      )
    }
    if (
      typeof rating.fast3GLoadTime === 'number' &&
      rating.fast3GLoadTime > 7000
    ) {
      perf.push(
        `Fast 3G load time is ${rating.fast3GLoadTime}ms (should be under 7000ms)`,
      )
    }
    if (
      typeof rating.slow3GLoadTime === 'number' &&
      rating.slow3GLoadTime > 15000
    ) {
      perf.push(
        `Slow 3G load time is ${rating.slow3GLoadTime}ms (should be under 15000ms)`,
      )
    }
    if (rating.webpUsage.length > 0) {
      const files = rating.webpUsage.map((f) => f.split('?')[0]).join('\n')
      perf.push(`Images that need WebP conversion:\n${files}`)
    }
    if (rating.avifUsage.length > 0) {
      const files = rating.avifUsage.map((f) => f.split('?')[0]).join('\n')
      perf.push(`Videos that need compression:\n${files}`)
    }
    if (rating.cacheControlUsage.length > 0) {
      const files = rating.cacheControlUsage
        .map((f) => f.split('?')[0])
        .join('\n')
      perf.push(`Files missing cache-control headers:\n${files}`)
    }
    if (rating.compressionUsage.length > 0) {
      const files = rating.compressionUsage
        .map((f) => f.split('?')[0])
        .join('\n')
      perf.push(`Files not using transfer compression (gzip/brotli):\n${files}`)
    }
    if (perf.length > 0) {
      sections.push(`\nPerformance:\n${perf.join('\n\n')}`)
    }

    sections.push(
      '\nProvide specific code changes and configuration recommendations to fix these issues.',
    )

    return sections.join('\n')
  }, [rating, meta])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white border flex items-center justify-center gap-1 px-3 py-1.5 mt-1 rounded-full hover:shadow-sm hover:bg-muted transition-shadow cursor-pointer">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles
              size={16}
              className="animate-[rainbow-icon_3s_linear_infinite]"
            />
            <span className="bg-[linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#06b6d4,#3b82f6,#8b5cf6,#ec4899,#ef4444)] bg-[length:200%_auto] animate-[rainbow_3s_linear_infinite] bg-clip-text text-transparent text-xs">
              Generate Improvements
            </span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Improvements Prompt</DialogTitle>
          <DialogDescription>
            Copy this prompt and paste it into an AI assistant to get
            recommendations for fixing your website issues.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <pre className="bg-gray-100 p-4 rounded-md text-xs whitespace-pre-wrap font-mono">
            {prompt}
          </pre>
        </div>
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className={`flex items-center gap-2 transition-colors ${
              copied
                ? 'text-green-600 border-green-600 hover:text-green-600'
                : ''
            }`}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
