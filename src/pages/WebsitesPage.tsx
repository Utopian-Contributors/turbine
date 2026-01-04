import { CameraOff } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useLocation, useNavigate } from 'react-router'

import Search from '@/components/blocks/search'
import PreloadImage from '@/components/ui/preload-image-cover'
import StarRating from '@/components/ui/StarRating'

import { useWebsitesQuery, type WebsiteHost } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WebsitesPageProps {}

const WebsitesPage: React.FC<WebsitesPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    data: websitesQueryData,
    refetch,
    fetchMore: fetchMoreWebsites,
  } = useWebsitesQuery({ variables: { pagination: { take: 12 } } })
  const [hasMoreWebsites, setHasMoreWebsites] = useState(true)
  const [iconError, setIconError] = useState<Record<string, boolean>>({})

  const loadMoreWebsites = useCallback(() => {
    if (hasMoreWebsites) {
      fetchMoreWebsites({
        variables: {
          pagination: {
            skip: websitesQueryData?.websites?.length,
            take: 10,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if ((fetchMoreResult.websites?.length ?? 0) < 10) {
            setHasMoreWebsites(false)
          }
          if (
            prev.websites &&
            fetchMoreResult.websites &&
            (fetchMoreResult.websites?.length ?? 0) > 0
          ) {
            return Object.assign({}, prev, {
              websites: [...prev.websites, ...fetchMoreResult.websites],
            })
          }
          return prev
        },
      })
    }
  }, [fetchMoreWebsites, hasMoreWebsites, websitesQueryData?.websites?.length])

  const { ref: lastWebsiteRef, inView: lastWebsiteRefInView } = useInView()
  useEffect(() => {
    if (lastWebsiteRefInView && hasMoreWebsites) {
      loadMoreWebsites()
    }
  }, [hasMoreWebsites, lastWebsiteRefInView, loadMoreWebsites])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q') || ''
    refetch({ query })
  }, [location.search, refetch])

  const getRating = useCallback((website: WebsiteHost) => {
    return website.ratings?.find(
      (r) =>
        new Date(r.createdAt).getTime() ===
        Math.max(
          ...(website.ratings?.map((rating) =>
            new Date(rating.createdAt).getTime()
          ) || [])
        )
    )
  }, [])

  return (
    <div className="p-6 pb-40 lg:pb-6">
      <div className="lg:max-w-5xl mx-auto">
        <Search
          placeholder="Search websites..."
          onChange={(value) => {
            navigate(
              '/websites?' + new URLSearchParams({ q: value }).toString()
            )
          }}
        />
        <div className="flex lg:flex-row lg:flex-wrap flex-col gap-8 lg:gap-1 mt-6">
          {websitesQueryData?.websites?.map(
            (website, index) =>
              website.rootMeasurement && (
                <div
                  key={website.id}
                  onClick={() => {
                    navigate(`/measurements/${website.host}`)
                  }}
                  className="cursor-pointer lg:w-[calc(100%/3-0.25rem)] shadow-sm lg:shadow-none rounded-lg flex flex-col lg:flex-row lg:gap-2 overflow-hidden"
                  ref={
                    index === websitesQueryData.websites!.length - 1
                      ? lastWebsiteRef
                      : null
                  }
                >
                  <div className="relative lg:mx-1 lg:my-2 w-full border rounded-lg overflow-hidden">
                    <PreloadImage
                      src={website.thumbnail}
                      className="h-48 md:h-128 lg:h-48 w-full bg-cover bg-center"
                    >
                      {(error) =>
                        error && (
                          <div
                            className="h-48 md:h-128 lg:h-48 w-full"
                            style={{
                              background:
                                'linear-gradient(to bottom, var(--color-green-300), transparent), repeating-conic-gradient(#fff 0 25%, #fef 0 50%) 50% / 20px 20px',
                            }}
                          >
                            <CameraOff
                              className="relative top-1/2 -translate-y-1/2 mx-auto text-white stroke-1"
                              size={128}
                            />
                          </div>
                        )
                      }
                    </PreloadImage>
                    <div className="lg:max-w-[calc(100%-2px)] w-full p-2 bg-white flex flex-col gap-2">
                      <StarRating
                        rating={getRating(website as WebsiteHost)?.overallScore}
                      />
                      <div className="max-w-full flex items-center gap-2">
                        {website.icon && !iconError[website.icon] ? (
                          <img
                            src={website.icon}
                            alt={`${website.host} icon`}
                            className="w-[32px] h-[32px]"
                            onError={() =>
                              setIconError({
                                ...iconError,
                                [website.icon!]: true,
                              })
                            }
                          />
                        ) : null}
                        <div className="w-full flex flex-col">
                          <h3 className="max-w-[calc(100%-40px)] text-lg truncate overflow-hidden m-0">
                            {website.title}
                          </h3>
                          <span className="text-gray-400 text-xs">
                            {website.rootMeasurement?.redirect ||
                              website.rootMeasurement?.url}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  )
}

export default WebsitesPage
