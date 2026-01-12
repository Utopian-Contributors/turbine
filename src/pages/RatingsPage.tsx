import StarRating from '@/components/ui/StarRating'
import React, { useCallback, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toHeaderCase } from 'js-convert-case'
import { ArrowLeft, CheckIcon, CircleQuestionMark, XIcon } from 'lucide-react'
import { useWebsiteRatingQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RatingsPageProps {}

interface RatingsSectionProps {
  title: string
  description: string
  value?: boolean | number | string
  files?: string[]
  error?: string
  errorScreenshot?: string
  learnMoreUrl?: string
}

const RatingsSection: React.FC<RatingsSectionProps> = ({
  title,
  description,
  value,
  files,
  error,
  errorScreenshot,
  learnMoreUrl,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center p-1">
      <div className="flex gap-3">
        {error ? (
          <div className="hidden md:block w-fit h-fit bg-red-500 text-white rounded-full p-1 mt-1">
            <XIcon size={16} />
          </div>
        ) : (
          <div className="hidden md:block w-fit h-fit bg-green-500 text-white rounded-full p-1 mt-1">
            <CheckIcon size={16} />
          </div>
        )}
        <div className="flex flex-col gap-2 md:block">
          <div className="md:hidden mx-[-0.25rem]">
            {error && !errorScreenshot ? (
              <span className="bg-red-100 rounded-sm font-medium px-2 py-1">
                {error}
              </span>
            ) : null}
            {!error && typeof value !== 'boolean' ? (
              <span className="bg-green-100 rounded-sm font-medium px-2 py-1">
                {value}
              </span>
            ) : null}
          </div>
          <h3 className="hidden md:block text-lg font-medium">{title}</h3>
          <div className="flex gap-1 items-center mb-1 lg:mb-2">
            <p className="text-sm text-gray-500">{description}</p>
            <a href={learnMoreUrl} target="_blank">
              <CircleQuestionMark
                size={16}
                className="cursor-pointer text-gray-400"
              />
            </a>
          </div>
          {errorScreenshot && (
            <img
              src={errorScreenshot}
              alt={error}
              className="max-h-[16rem] max-w-sm"
            />
          )}
          {files && files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
              {files.map((f) => {
                const filename = f.slice(f.lastIndexOf('/') + 1)
                const filenameWithoutParams = filename.split('?')[0]
                return (
                  <div className="underline" key={f}>
                    {filenameWithoutParams}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block">
        {error && !errorScreenshot ? (
          <span className="bg-red-100 rounded-sm font-medium px-2 py-1">
            {error}
          </span>
        ) : null}
        {!error && typeof value !== 'boolean' ? (
          <span className="bg-gray-100 rounded-sm font-medium px-2 py-1">
            {value}
          </span>
        ) : null}
      </div>
    </div>
  )
}

const RatingsPage: React.FC<RatingsPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const search = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )

  const { data: websiteQueryData } = useWebsiteRatingQuery({
    variables: { host: params.host! },
  })

  const rating = useMemo(() => {
    return websiteQueryData?.website?.ratings?.find(
      (r) => new URL(r.url).pathname === search.get('path')
    )
  }, [search, websiteQueryData?.website?.ratings])

  const getDefaultOpenAccordionItem = useCallback((rating?: number) => {
    switch (rating) {
      case 1:
        return ['metadata']
      case 2:
        return ['accessibility']
      case 3:
        return ['performance']
      case 4:
        return ['compliance']
      default:
        return undefined
    }
  }, [])

  return (
    <div className="max-w-screen lg:max-w-3xl mx-auto p-4 pb-40 lg:py-6">
      <div
        className="group cursor-pointer flex items-center gap-2 mb-4"
        onClick={() => {
          navigate(
            '/measurements/' +
              websiteQueryData?.website?.host +
              '?path=' +
              search.get('path')
          )
        }}
      >
        <ArrowLeft size={20} className="text-muted-foreground" />
        <span className="group-hover:underline text-md text-muted-foreground">
          Back to measurements of {websiteQueryData?.website?.host}
        </span>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="lg:px-2 text-3xl lg:text-4xl">{params.host}</h1>
          <span className="text-2xl text-muted-foreground font-light ml-2">
            {search.get('path') === '/' ? 'Root Page' : search.get('path')}
          </span>
        </div>
        {rating && (
          <div className="flex flex-col lg:items-end gap-2">
            <StarRating size={40} rating={rating?.overallScore} />
          </div>
        )}
      </div>
      {typeof rating?.overallScore === 'undefined' && (
        <div className="border rounded-lg p-4 mt-6">
          <h2 className="text-lg lg:text-xl">No ratings available.</h2>
          <p className="text-muted-foreground mt-2">
            A website must be measured using WiFi, Fast 3G & Slow 3G in order to
            get a rating.
          </p>
        </div>
      )}
      {rating?.overallScore && (
        <Accordion
          type="multiple"
          defaultValue={getDefaultOpenAccordionItem(rating?.overallScore)}
          className="mt-6"
        >
          <AccordionItem
            value="security"
            className="border border-gray-100 rounded-lg px-4 mb-4"
          >
            <AccordionTrigger value="security">
              <div className="flex flex-col gap-2">
                <span className="text-xl min-w-32">Security</span>
                <StarRating
                  animated={false}
                  grayscale={rating.overallScore < 1}
                  size={24}
                  rating={1}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 lg:gap-0 mt-2">
                <RatingsSection
                  title="HTTPS"
                  description="Has a valid HTTPS certificate."
                  value={rating.httpsSupport}
                  error={
                    !rating.httpsSupport
                      ? "Doesn't have HTTPS support"
                      : undefined
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Glossary/HTTPS"
                />
                <RatingsSection
                  title="No mixed content"
                  description="All resources are loaded over HTTPS."
                  value={rating.noMixedContent}
                  error={
                    !rating.noMixedContent
                      ? 'Contains mixed content'
                      : undefined
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="metadata"
            className="border border-gray-100 rounded-lg px-4 mb-4"
          >
            <AccordionTrigger value="metadata">
              <div className="flex flex-col gap-2">
                <span className="text-xl min-w-32">Metadata</span>
                <StarRating
                  animated={false}
                  grayscale={rating.overallScore < 2}
                  size={24}
                  rating={2}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 lg:gap-0 mt-2">
                <RatingsSection
                  title="Favicon"
                  description="Has a favicon."
                  value={rating.hasFavicon}
                  error={
                    !rating.hasFavicon ? "Doesn't have a favicon" : undefined
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Glossary/Favicon"
                />
                <RatingsSection
                  title="Description meta tag"
                  description="Has a description meta tag."
                  value={rating.hasDescription}
                  error={
                    !rating.hasDescription
                      ? 'No description meta tag was found'
                      : undefined
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#setting_a_meta_description"
                />
                <RatingsSection
                  title="Thumbnail meta tag"
                  description="Contains an og:image meta tag for social media sharing."
                  value={rating.hasOgImage}
                  error={
                    !rating.hasOgImage
                      ? 'No og:image meta tag was found'
                      : undefined
                  }
                  learnMoreUrl="https://ogp.me/"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="accessibility"
            className="border border-gray-100 rounded-lg px-4 mb-4"
          >
            <AccordionTrigger value="accessibility">
              <div className="flex flex-col gap-2">
                <span className="text-xl min-w-32">Accessibility</span>
                <StarRating
                  animated={false}
                  grayscale={rating.overallScore < 3}
                  size={24}
                  rating={3}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 lg:gap-0 mt-2">
                {rating.accessibility.length
                  ? rating.accessibility.map((v, index) => (
                      <RatingsSection
                        key={v.violationId + ' ' + index}
                        title={toHeaderCase(v.violationId)}
                        description={v.description}
                        error={v.description}
                        errorScreenshot={
                          v.screenshots?.length ? v.screenshots[0] : undefined
                        }
                        learnMoreUrl={v.helpUrl}
                      />
                    ))
                  : 'No accessibility issues found.'}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="performance"
            className="border border-gray-100 rounded-lg px-4 mb-4"
          >
            <AccordionTrigger value="performance">
              <div className="flex flex-col gap-2">
                <span className="text-xl min-w-32">Performance</span>
                <StarRating
                  animated={false}
                  grayscale={rating.overallScore < 4}
                  size={24}
                  rating={4}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 lg:gap-0 mt-2">
                <RatingsSection
                  title="Wifi Load Time"
                  description="Has a decent load time on a wifi connection."
                  value={rating.stableLoadTime + 'ms'}
                  error={
                    rating.stableLoadTime! > 3000
                      ? 'Takes longer than 3s to load'
                      : undefined
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Web/Performance"
                />
                <RatingsSection
                  title="Fast3G Load Time"
                  description="Has a decent load time on a fast 3G connection."
                  value={
                    typeof rating.fast3GLoadTime === 'number'
                      ? rating.fast3GLoadTime + 'ms'
                      : undefined
                  }
                  error={
                    typeof rating.fast3GLoadTime === 'number'
                      ? rating.fast3GLoadTime! > 7000
                        ? 'Takes longer than 7s to load'
                        : undefined
                      : 'No data available'
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Web/Performance"
                />
                <RatingsSection
                  title="Slow3G Load Time"
                  description="Has a decent load time on a slow 3G connection."
                  value={
                    typeof rating.slow3GLoadTime === 'number'
                      ? rating.slow3GLoadTime + 'ms'
                      : undefined
                  }
                  error={
                    typeof rating.slow3GLoadTime === 'number'
                      ? rating.slow3GLoadTime! > 15000
                        ? 'Takes longer than 15s to load'
                        : undefined
                      : 'No data available'
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Web/Performance"
                />
                <RatingsSection
                  title="Compressed Images"
                  description="Uses compressed images instead of PNG."
                  error={
                    rating.webpUsage.length > 0
                      ? 'Contains uncompressed images'
                      : undefined
                  }
                  value={
                    rating.webpUsage.length === 0
                      ? 'No uncompressed images found'
                      : undefined
                  }
                  files={rating.webpUsage}
                  learnMoreUrl="https://developers.google.com/speed/webp"
                />
                <RatingsSection
                  title="Compressed Videos"
                  description="Uses compressed videos instead of uncompressed formats."
                  error={
                    rating.avifUsage.length > 0
                      ? 'Contains uncompressed videos'
                      : undefined
                  }
                  value={
                    rating.avifUsage.length === 0
                      ? 'No uncompressed videos found'
                      : undefined
                  }
                  files={rating.avifUsage}
                  learnMoreUrl="https://en.wikipedia.org/wiki/AVIF"
                />
                <RatingsSection
                  title="Cache Controls"
                  description="Uses cache control headers effectively."
                  error={
                    rating.cacheControlUsage.length > 0
                      ? 'Contains files without proper cache control'
                      : undefined
                  }
                  value={
                    rating.cacheControlUsage.length === 0
                      ? 'All files use cache control'
                      : undefined
                  }
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching"
                />
                <RatingsSection
                  title="Transfer Compression"
                  description="Uses transfer compression effectively."
                  error={
                    rating.compressionUsage.length > 0
                      ? 'Some files are uncompressed'
                      : undefined
                  }
                  value={
                    rating.compressionUsage.length === 0
                      ? 'All files use transfer compression'
                      : undefined
                  }
                  files={rating.compressionUsage}
                  learnMoreUrl="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Encoding"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}

export default RatingsPage
