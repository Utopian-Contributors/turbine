import React, { useCallback, useEffect, useState } from 'react'

import Search from '@/components/blocks/search'
import PreloadImage from '@/components/ui/preload-image-cover'
import StarRating from '@/components/ui/StarRating'
import { Globe } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { useWebsitesQuery, type WebsiteHost } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WebsitesPageProps {}

const WebsitesPage: React.FC<WebsitesPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: websitesQueryData, refetch } = useWebsitesQuery()
  const [iconError, setIconError] = useState<Record<string, boolean>>({})

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
        <div className="flex lg:flex-row lg:flex-wrap flex-col gap-8 lg:gap-4 mt-6">
          {websitesQueryData?.websites?.map(
            (website) =>
              website.rootMeasurement && (
                <div
                  key={website.id}
                  onClick={() => {
                    navigate(`/measurements/${website.host}`)
                  }}
                  className="cursor-pointer lg:w-[calc(100%/3-0.75rem)] shadow-sm lg:shadow-none rounded-lg flex flex-col lg:flex-row lg:gap-2 overflow-hidden"
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
                                'radial-gradient(var(--color-green-400), transparent), repeating-conic-gradient(#fff 0 25%, #fef 0 50%) 50% / 20px 20px',
                            }}
                          >
                            <Globe
                              className="relative top-1/2 -translate-y-1/2 mx-auto text-white"
                              size={80}
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
