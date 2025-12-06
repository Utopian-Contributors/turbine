import { Check, CopyIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import type { FontCategory } from '../../../generated/graphql'
import { Button } from '../ui/button'

interface FontEmbedConfigProps {
  fontName: string
  variants: string[]
  files: { variant: string; url: string }[]
  category?: FontCategory
}

const getFontVariantName = (variant: string): string => {
  if (variant === 'regular') return '400 Regular'
  if (variant === 'italic') return '400 Italic'
  if (variant === '100') return '100 Thin'
  if (variant === '100italic') return '100 Italic Thin'
  if (variant === '200') return '200 Extra Light'
  if (variant === '200italic') return '200 Italic Extra Light'
  if (variant === '300') return '300 Light'
  if (variant === '300italic') return '300 Italic Light'
  if (variant === '400') return '400 Regular'
  if (variant === '400italic') return '400 Italic Regular'
  if (variant === '500') return '500 Medium'
  if (variant === '500italic') return '500 Italic Medium'
  if (variant === '600') return '600 Semi Bold'
  if (variant === '600italic') return '600 Italic Semi Bold'
  if (variant === '700') return '700 Bold'
  if (variant === '700italic') return '700 Italic Bold'
  if (variant === '800') return '800 Extra Bold'
  if (variant === '800italic') return '800 Italic Extra Bold'
  if (variant === '900') return '900 Black'
  if (variant === '900italic') return '900 ItalicBlack'
  return variant
}

const FontEmbedConfig: React.FC<FontEmbedConfigProps> = ({
  fontName,
  files,
  category,
}) => {
  const [italicMode, setItalicMode] = useState<'include' | 'exclude'>('include')
  const [weightMode, setWeightMode] = useState<'full' | 'single'>('full')
  const [weightValue, setWeightValue] = useState<number>(400)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [copiedCSS, setCopiedCSS] = useState(false)

  // Parse variants to extract available weights
  const availableWeights = useMemo(() => {
    const weights = new Set<number>()

    files.forEach((file) => {
      // Variants can be like: "regular", "italic", "300", "300italic", "700", "700italic"
      const match = file.variant.match(/^(\d+)/)
      if (match) {
        weights.add(parseInt(match[1], 10))
      } else if (file.variant === 'regular') {
        weights.add(400)
      }
    })

    return Array.from(weights).sort((a, b) => a - b)
  }, [files])

  const selectedFile = useMemo(() => {
    return files.find((file) => {
      return (
        file.variant ===
        (weightValue === 400 ? 'regular' : weightValue.toString())
      )
    })
  }, [files, weightValue])

  const generateEmbedUrl = () => {
    let params = ''

    const minWeight = availableWeights[0]
    const maxWeight = availableWeights[availableWeights.length - 1]

    if (italicMode === 'include' && weightMode === 'full') {
      // Full italic range (0-1) and full weight range using range syntax
      params = `ital,wght@0,${minWeight}..${maxWeight};1,${minWeight}..${maxWeight}`
    } else if (italicMode === 'exclude' && weightMode === 'full') {
      // Exclude italic value, full weight range
      params = `wght@${minWeight}..${maxWeight}`
    } else if (italicMode === 'include' && weightMode === 'single') {
      // Full italic range, single weight
      params = `ital,wght@0,${weightValue};1,${weightValue}`
    } else {
      // Exclude italic, single weight
      params = `wght@${weightValue}`
    }

    return `https://fonts.googleapis.com/css2?family=${fontName.replace(
      / /g,
      '+'
    )}:${params}&display=swap`
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="px-2 space-y-4 max-h-[calc(100vh-107px-5rem)] overflow-y-auto">
        {weightMode === 'full' ? (
          files.map((file) => (
            <style>
              {`@font-face {
              font-family: "${fontName}-${file.variant}";
              src: url("${file.url}");
              font-display: block;
            }`}
            </style>
          ))
        ) : selectedFile ? (
          <style>
            {`@font-face {
              font-family: "${fontName}-${selectedFile.variant}";
              src: url("${selectedFile.url}");
              font-display: block;
            }`}
          </style>
        ) : null}
        {weightMode === 'full' ? (
          <div className="flex flex-col gap-4">
            {[...files]
              .sort((a, b) => {
                let weightA = 0
                let weightB = 0
                if (a.variant === 'regular' || a.variant === 'italic') {
                  weightA = 400
                } else {
                  weightA = parseInt(a.variant.replace('italic', ''))
                }
                if (b.variant === 'regular' || b.variant === 'italic') {
                  weightB = 400
                } else {
                  weightB = parseInt(b.variant.replace('italic', ''))
                }
                return weightA - weightB
              })
              .map((file) => (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">
                    {getFontVariantName(file.variant)}
                  </span>
                  <span
                    className="text-xl"
                    style={{ fontFamily: `${fontName}-${file.variant}` }}
                  >
                    Joyful, bold coders maximize the web's unique sparkle
                    without hazy gatekeeper quotas.
                  </span>
                </div>
              ))}
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">
              {getFontVariantName(selectedFile.variant)}
            </span>
            <span
              className="text-xl"
              style={{ fontFamily: `${fontName}-${selectedFile.variant}` }}
            >
              Joyful, bold coders maximize the web's unique sparkle without hazy
              gatekeeper quotas.
            </span>
          </div>
        ) : null}
      </div>
      <div className="bg-gradient-to-t from-primary/2 to-card h-fit border p-4 rounded-lg flex flex-col gap-6">
        {/* Italic Configuration */}
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-light">Italic</h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setItalicMode('include')}
              variant={italicMode === 'include' ? 'outline' : 'ghost'}
            >
              Include
            </Button>
            <Button
              size="sm"
              onClick={() => setItalicMode('exclude')}
              variant={italicMode === 'exclude' ? 'outline' : 'ghost'}
            >
              Exclude
            </Button>
          </div>
        </div>

        {/* Weight Configuration */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-md font-light">Weight</h3>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setWeightMode('full')}
                variant={weightMode === 'full' ? 'outline' : 'ghost'}
              >
                Full axis
              </Button>
              <Button
                size="sm"
                onClick={() => setWeightMode('single')}
                variant={weightMode === 'single' ? 'outline' : 'ghost'}
              >
                One value
              </Button>
            </div>
          </div>
          <div>
            {weightMode === 'full' ? null : (
              <div className="flex flex-wrap gap-2">
                {availableWeights.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setWeightValue(weight)}
                    className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                      weightValue === weight
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'text-gray-700 border border-gray-300 hover:shadow-sm transition-shadow duration-200'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-light">Embed Code</h3>
            <Button
              size="sm"
              variant="ghost"
              className={`flex items-center gap-2 transition-colors ${
                copiedEmbed ? 'text-green-600 hover:text-green-600' : ''
              }`}
              onClick={() => {
                const embedCode = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${generateEmbedUrl()}" rel="stylesheet">`
                navigator.clipboard.writeText(embedCode)
                setCopiedEmbed(true)
                setTimeout(() => setCopiedEmbed(false), 2000)
              }}
            >
              {copiedEmbed ? (
                <Check className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
              {copiedEmbed ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
            {`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${generateEmbedUrl()}" rel="stylesheet">`}
          </pre>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-light">CSS Code</h3>
            <Button
              size="sm"
              variant="ghost"
              className={`flex items-center gap-2 transition-colors ${
                copiedCSS ? 'text-green-600 hover:text-green-600' : ''
              }`}
              onClick={() => {
                const cssCode = `.${fontName.replace(/ /g, '-').toLowerCase()} {
  font-family: "${fontName}", ${category?.replace('_', ' ').toLowerCase()};
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}
`
                navigator.clipboard.writeText(cssCode)
                setCopiedCSS(true)
                setTimeout(() => setCopiedCSS(false), 2000)
              }}
            >
              {copiedCSS ? (
                <Check className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
              {copiedCSS ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
            {`.${fontName.replace(/ /g, '-').toLowerCase()} {
  font-family: "${fontName}", ${category?.replace('_', ' ').toLowerCase()};
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}
`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default FontEmbedConfig
