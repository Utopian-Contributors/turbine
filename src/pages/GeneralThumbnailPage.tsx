import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import {
  Check,
  Copy,
  Download,
  Grid2x2,
  Loader2,
  Moon,
  RefreshCw,
  Square,
  Sun,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

type OgTheme = 'dark' | 'light'
type OgStyle = 'single' | 'pattern'
type OgFont = 'sans' | 'serif' | 'mono'

const STORAGE_KEY = 'general-thumbnail-settings'

interface ThumbnailSettings {
  title: string
  subtitle: string
  icon: string
  theme: OgTheme
  style: OgStyle
  titleFont: OgFont
  subtitleFont: OgFont
}

const loadSettings = (): Partial<ThumbnailSettings> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const GeneralThumbnailPage: React.FC = () => {
  const savedSettings = useMemo(() => loadSettings(), [])

  // Customization state
  const [title, setTitle] = useState(savedSettings.title ?? 'Turbine')
  const [subtitle, setSubtitle] = useState(savedSettings.subtitle ?? 'Faster than the competition.')
  const [icon, setIcon] = useState(savedSettings.icon ?? 'https://turbine.utopian.build/logo.webp')
  const [theme, setTheme] = useState<OgTheme>(savedSettings.theme ?? 'dark')
  const [style, setStyle] = useState<OgStyle>(savedSettings.style ?? 'single')
  const [titleFont, setTitleFont] = useState<OgFont>(savedSettings.titleFont ?? 'sans')
  const [subtitleFont, setSubtitleFont] = useState<OgFont>(savedSettings.subtitleFont ?? 'sans')

  // Thumbnail state
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Copy state
  const [copied, setCopied] = useState(false)

  // Generate cache key from title (or use a random key)
  const cacheKey = useMemo(() => {
    return encodeURIComponent(title || 'general-thumbnail-' + Date.now())
  }, [title])

  // Base URL for OG endpoint
  const ogBaseUrl = useMemo(() => {
    return (
      import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '') ||
      'http://localhost:4000'
    )
  }, [])

  // Build thumbnail URL for generation (includes all params)
  const buildThumbnailUrl = useCallback(
    (mode?: 'update') => {
      const params = new URLSearchParams({
        title: title || 'Untitled',
        icon: icon || '',
        key: cacheKey,
        theme,
        style,
        titleFont,
        subtitleFont,
      })

      if (subtitle) {
        params.set('subtitle', subtitle)
      }

      if (mode === 'update') {
        params.set('mode', 'update')
      }

      return `${ogBaseUrl}/og?${params.toString()}`
    },
    [
      title,
      subtitle,
      icon,
      theme,
      style,
      titleFont,
      subtitleFont,
      cacheKey,
      ogBaseUrl,
    ],
  )

  // Build integration URL (full URL with all configured params)
  const integrationUrl = useMemo(() => {
    return buildThumbnailUrl()
  }, [buildThumbnailUrl])

  // Generate thumbnail
  const generateThumbnail = useCallback(
    async (forceUpdate = false) => {
      if (!icon) {
        setError('Icon URL is required')
        return
      }

      setIsGenerating(true)
      setError(null)

      try {
        const thumbnailApiUrl = buildThumbnailUrl(
          forceUpdate ? 'update' : undefined,
        )

        // Fetch the thumbnail to trigger generation
        const response = await fetch(thumbnailApiUrl).catch(() => {
          setError('Failed to fetch thumbnail')
        })

        if (!response?.ok) {
          const errorData = await response?.json()
          throw new Error(errorData.error || 'Failed to generate thumbnail')
        }

        // Create blob URL for display
        const blob = await response?.blob()
        const blobUrl = URL.createObjectURL(blob)

        // Revoke previous URL to avoid memory leak
        if (thumbnailUrl) {
          URL.revokeObjectURL(thumbnailUrl)
        }

        setThumbnailUrl(blobUrl)
        setHasChanges(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsGenerating(false)
      }
    },
    [buildThumbnailUrl, icon, thumbnailUrl],
  )

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    const settings: ThumbnailSettings = {
      title,
      subtitle,
      icon,
      theme,
      style,
      titleFont,
      subtitleFont,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [title, subtitle, icon, theme, style, titleFont, subtitleFont])

  // Save to localStorage whenever settings change
  useEffect(() => {
    saveSettings()
  }, [saveSettings])

  // Auto-generate thumbnail on mount if we have saved settings with an icon
  useEffect(() => {
    if (icon && !thumbnailUrl && !isGenerating && !error) {
      generateThumbnail(false)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track changes
  const handleFieldChange = useCallback(
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
      setter(value)
      setHasChanges(true)
    },
    [],
  )

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl)
      }
    }
  }, [thumbnailUrl])

  return (
    <div className="flex h-full flex-col gap-6 p-6 pb-40 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dynamic Thumbnail Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create custom Open Graph thumbnails for your pages
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Preview */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Preview</h2>
          <div
            className={cn(
              'relative aspect-[1200/630] w-full max-w-screen overflow-hidden rounded-lg border bg-muted',
              isGenerating && 'animate-pulse',
            )}
          >
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              </div>
            )}
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Dynamic Thumbnail Preview"
                className="h-full w-full object-cover"
              />
            )}
            {!thumbnailUrl && !isGenerating && (
              <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground">
                  Configure options and generate preview
                </span>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Integration Code Snippet */}
          {thumbnailUrl && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Integration</h3>
              <div className="relative rounded-lg border bg-muted/50 p-3">
                <button
                  onClick={() => {
                    const code = `<meta property="og:image" content="${integrationUrl}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:image" content="${integrationUrl}" />`
                    navigator.clipboard.writeText(code)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="cursor-pointer absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground bg-muted hover:text-foreground"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre className="overflow-x-auto pr-8 text-xs text-muted-foreground">
                  <code>{`<meta property="og:image" content="${integrationUrl}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${integrationUrl}" />`}</code>
                </pre>
              </div>
              <p className="text-xs text-muted-foreground">
                Add these meta tags to your page's {'<head>'} section.
              </p>

              {/* Info box about OG images */}
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 p-3">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  What are OG images?
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Open Graph (OG) images are the preview thumbnails that appear
                  when your page is shared on social media platforms like
                  Twitter, Facebook, LinkedIn, Slack, and Discord. A
                  well-designed OG image can significantly increase
                  click-through rates and make your content stand out in feeds.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Customization Options */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Customize</h2>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleFieldChange(setTitle, e.target.value)}
                placeholder="Enter title"
              />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-2">
              <label htmlFor="subtitle" className="text-sm font-medium">
                Subtitle
              </label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => handleFieldChange(setSubtitle, e.target.value)}
                placeholder="Enter subtitle (optional)"
              />
            </div>

            {/* Icon URL */}
            <div className="flex flex-col gap-2">
              <label htmlFor="icon" className="text-sm font-medium">
                Icon URL
              </label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => handleFieldChange(setIcon, e.target.value)}
                placeholder="https://example.com/icon.png"
              />
              {icon && (
                <div className="flex items-center gap-2">
                  <img
                    key={icon}
                    src={icon}
                    alt="Icon preview"
                    className="h-8 w-8 rounded object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    Icon preview
                  </span>
                </div>
              )}
            </div>

            {/* Theme */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Theme</label>
              <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(value) => {
                  if (value) handleFieldChange(setTheme, value as OgTheme)
                }}
                variant="outline"
              >
                <ToggleGroupItem value="dark" className="flex-1">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </ToggleGroupItem>
                <ToggleGroupItem value="light" className="flex-1">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Style */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Style</label>
              <ToggleGroup
                type="single"
                value={style}
                onValueChange={(value) => {
                  if (value) handleFieldChange(setStyle, value as OgStyle)
                }}
                variant="outline"
              >
                <ToggleGroupItem value="single" className="flex-1">
                  <Square className="mr-2 h-4 w-4" />
                  Single
                </ToggleGroupItem>
                <ToggleGroupItem value="pattern" className="flex-1">
                  <Grid2x2 className="mr-2 h-4 w-4" />
                  Pattern
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-2">
              {/* Title Font */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Title Font</label>
                <ToggleGroup
                  type="single"
                  value={titleFont}
                  onValueChange={(value) => {
                    if (value) handleFieldChange(setTitleFont, value as OgFont)
                  }}
                  variant="outline"
                >
                  <ToggleGroupItem value="sans" className="flex-1">
                    Sans
                  </ToggleGroupItem>
                  <ToggleGroupItem value="serif" className="flex-1">
                    Serif
                  </ToggleGroupItem>
                  <ToggleGroupItem value="mono" className="flex-1">
                    Mono
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Subtitle Font */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Subtitle Font</label>
                <ToggleGroup
                  type="single"
                  value={subtitleFont}
                  onValueChange={(value) => {
                    if (value)
                      handleFieldChange(setSubtitleFont, value as OgFont)
                  }}
                  variant="outline"
                >
                  <ToggleGroupItem value="sans" className="flex-1">
                    Sans
                  </ToggleGroupItem>
                  <ToggleGroupItem value="serif" className="flex-1">
                    Serif
                  </ToggleGroupItem>
                  <ToggleGroupItem value="mono" className="flex-1">
                    Mono
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => generateThumbnail(true)}
                disabled={isGenerating || !icon}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {hasChanges ? 'Update Thumbnail URL' : 'Generate Thumbnail'}
                  </>
                )}
              </Button>
              {thumbnailUrl && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = thumbnailUrl
                    link.download = 'og_image.webp'
                    link.click()
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            {hasChanges && (
              <p className="text-xs text-muted-foreground">
                You have unsaved changes. Click "Update Thumbnail" to save.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralThumbnailPage
