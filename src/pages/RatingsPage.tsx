import StarRating from '@/components/ui/StarRating'
import moment from 'moment'
import React, { useCallback } from 'react'
import { useParams } from 'react-router'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { toHeaderCase } from 'js-convert-case'
import { CheckIcon, XIcon } from 'lucide-react'
import { useWebsiteRatingQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RatingsPageProps {}

interface RatingsSectionProps {
  title: string
  description: string
  value?: boolean | number | string
  error?: string
}

const RatingsSection: React.FC<RatingsSectionProps> = ({
  title,
  description,
  value,
  error,
}) => {
  return (
    <div className="flex justify-between items-center p-1">
      <div className="flex gap-3">
        {error ? (
          <div className="w-fit h-fit bg-red-500 text-white rounded-full p-1 mt-1">
            <XIcon size={16} />
          </div>
        ) : (
          <div className="w-fit h-fit bg-green-500 text-white rounded-full p-1 mt-1">
            <CheckIcon size={16} />
          </div>
        )}
        <div>
          <h3>{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{description}</p>
        </div>
      </div>
      <div>
        {error ? (
          <span className="bg-red-100 rounded-sm font-medium px-2 py-1">
            {error}
          </span>
        ) : typeof value !== 'boolean' ? (
          <span className="bg-gray-100 rounded-sm font-medium px-2 py-1">
            {value}
          </span>
        ) : null}
      </div>
    </div>
  )
}

const RatingsPage: React.FC<RatingsPageProps> = () => {
  const params = useParams()
  const { data: websiteQueryData } = useWebsiteRatingQuery({
    variables: { host: params.host! },
  })

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
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between gap-4">
        <h1 className="px-2 text-4xl font-light">{params.host}</h1>
        <div className="flex flex-col items-end gap-2">
          <StarRating
            size={40}
            rating={websiteQueryData?.website?.rating?.overallScore}
          />
          <span className="text-xs text-gray-400 px-2">
            {websiteQueryData?.website?.rating
              ? moment(websiteQueryData?.website?.rating.createdAt).fromNow()
              : 'Not rated yet'}
          </span>
        </div>
      </div>
      {websiteQueryData?.website?.rating?.overallScore && (
        <Accordion
          type="multiple"
          defaultValue={getDefaultOpenAccordionItem(
            websiteQueryData?.website?.rating?.overallScore
          )}
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
                  grayscale={websiteQueryData.website.rating.overallScore < 1}
                  size={24}
                  rating={1}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col mt-2">
                <RatingsSection
                  title="HTTPS"
                  description="Has a valid HTTPS certificate."
                  value={websiteQueryData.website.rating.httpsSupport}
                  error={
                    !websiteQueryData.website.rating.httpsSupport
                      ? "Doesn't have HTTPS support"
                      : undefined
                  }
                />
                <RatingsSection
                  title="No mixed content"
                  description="All resources are loaded over HTTPS."
                  value={websiteQueryData.website.rating.noMixedContent}
                  error={
                    !websiteQueryData.website.rating.noMixedContent
                      ? 'Contains mixed content'
                      : undefined
                  }
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
                  grayscale={websiteQueryData.website.rating.overallScore < 2}
                  size={24}
                  rating={2}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col mt-2">
                <RatingsSection
                  title="Favicon"
                  description="Has a favicon."
                  value={websiteQueryData.website.rating.hasFavicon}
                  error={
                    !websiteQueryData.website.rating.hasFavicon
                      ? "Doesn't have a favicon"
                      : undefined
                  }
                />
                <RatingsSection
                  title="Description meta tag"
                  description="All resources are loaded over HTTPS."
                  value={websiteQueryData.website.rating.hasDescription}
                  error={
                    !websiteQueryData.website.rating.hasDescription
                      ? 'No description meta tag was found'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Thumbnail meta tag"
                  description="Contains a thumbnail image for social media sharing."
                  value={websiteQueryData.website.rating.hasOgImage}
                  error={
                    !websiteQueryData.website.rating.hasOgImage
                      ? 'No og:image meta tag was found'
                      : undefined
                  }
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
                  grayscale={websiteQueryData.website.rating.overallScore < 3}
                  size={24}
                  rating={3}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col mt-2">
                {websiteQueryData.website.rating.accessibility.length
                  ? websiteQueryData.website.rating.accessibility.map((v) => (
                      <RatingsSection
                        title={toHeaderCase(v.violationId)}
                        description={v.description}
                        value
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
                  grayscale={websiteQueryData.website.rating.overallScore < 4}
                  size={24}
                  rating={4}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col mt-2">
                <RatingsSection
                  title="Wifi Load Time"
                  description="Has a decent load time on a wifi connection."
                  value={websiteQueryData.website.rating.stableLoadTime + 'ms'}
                  error={
                    websiteQueryData.website.rating.stableLoadTime! > 3000
                      ? 'Takes longer than 3s to load'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Fast3G Load Time"
                  description="Has a decent load time on a fast 3G connection."
                  value={websiteQueryData.website.rating.fast3GLoadTime + 'ms'}
                  error={
                    websiteQueryData.website.rating.fast3GLoadTime! > 7000
                      ? 'Takes longer than 7s to load'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Slow3G Load Time"
                  description="Has a decent load time on a slow 3G connection."
                  value={websiteQueryData.website.rating.slow3GLoadTime + 'ms'}
                  error={
                    websiteQueryData.website.rating.slow3GLoadTime! > 15000
                      ? 'Takes longer than 15s to load'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Slow3G Load Time"
                  description="Has a decent load time on a slow 3G connection."
                  value={websiteQueryData.website.rating.slow3GLoadTime + 'ms'}
                  error={
                    websiteQueryData.website.rating.slow3GLoadTime! > 15000
                      ? 'Takes longer than 15s to load'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Compressed Images"
                  description="Uses compressed images instead of PNG."
                  error={
                    websiteQueryData.website.rating.webpUsage.length > 0
                      ? 'Contains uncompressed images'
                      : undefined
                  }
                  value={
                    websiteQueryData.website.rating.webpUsage.length === 0
                      ? 'No uncompressed images found'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Compressed Videos"
                  description="Uses compressed videos instead of uncompressed formats."
                  error={
                    websiteQueryData.website.rating.avifUsage.length > 0
                      ? 'Contains uncompressed videos'
                      : undefined
                  }
                  value={
                    websiteQueryData.website.rating.avifUsage.length === 0
                      ? 'No uncompressed videos found'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Cache Controls"
                  description="Uses cache control headers effectively."
                  error={
                    websiteQueryData.website.rating.cacheControlUsage.length > 0
                      ? 'Contains files without proper cache control'
                      : undefined
                  }
                  value={
                    websiteQueryData.website.rating.cacheControlUsage.length === 0
                      ? 'All files use cache control'
                      : undefined
                  }
                />
                <RatingsSection
                  title="Transfer Compression"
                  description="Uses transfer compression effectively."
                  error={
                    websiteQueryData.website.rating.compressionUsage.length > 0
                      ? 'Some files are uncompressed'
                      : undefined
                  }
                  value={
                    websiteQueryData.website.rating.compressionUsage.length === 0
                      ? 'All files use transfer compression'
                      : undefined
                  }
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
