import React from 'react'

import PreloadImage from '@/components/ui/preload-image-cover'
import StarRating from '@/components/ui/StarRating'
import { Globe, GlobeIcon } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router'
import { useWebsitesQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WebsitesPageProps {}

const WebsitesPage: React.FC<WebsitesPageProps> = () => {
  const navigate = useNavigate()
  const { data: websitesQueryData } = useWebsitesQuery()

  return (
    <div className="p-6 pb-40 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">Websites</h1>
        <div className="flex flex-col gap-8 md:gap-4 mt-6">
          {websitesQueryData?.websites?.map(
            (website) =>
              website.latestMeasurement && (
                <div
                  key={website.id}
                  onClick={() => {
                    const urlObj = new URL(website.latestMeasurement!.url)
                    navigate(
                      `/measurements/${urlObj.host}?path=${urlObj.pathname}`
                    )
                  }}
                  className="cursor-pointer shadow-sm md:shadow-none rounded-lg flex flex-col md:flex-row md:gap-2 overflow-hidden"
                >
                  <div className="relative md:mx-1 md:my-2 min-w-64 border rounded-lg overflow-hidden">
                    <PreloadImage
                      src={website.latestMeasurement.thumbnail}
                      className="h-48 w-full bg-cover bg-center"
                    >
                      {(error) =>
                        error && (
                          <div
                            className="h-48 w-full"
                            style={{
                              background:
                                'linear-gradient(to top, var(--color-green-500), transparent), repeating-conic-gradient(#fff 0 25%, #fef 0 50%) 50% / 20px 20px',
                            }}
                          >
                            <Globe
                              className="relative top-1/2 -translate-y-1/2 mx-auto text-white"
                              size={64}
                            />
                          </div>
                        )
                      }
                    </PreloadImage>
                    <div className="md:hidden w-full p-2 bg-white flex flex-col gap-2">
                      {website.rating?.overallScore && (
                        <StarRating rating={website.rating?.overallScore} />
                      )}
                      <div className="max-w-full flex items-center gap-2">
                        {website.latestMeasurement?.icon ? (
                          <img
                            src={website.latestMeasurement.icon}
                            alt={`${website.host} icon`}
                            className="w-[32px] h-[32px]"
                          />
                        ) : (
                          <div className="w-[32px] h-[32px] text-muted-foreground/10 flex justify-center items-center rounded-full">
                            <GlobeIcon
                              size={20}
                              className="text-muted-foreground"
                            />
                          </div>
                        )}
                        <div className="max-w-full flex flex-col">
                          <h3 className="max-w-full md:max-w-xs text-lg truncate m-0">
                            {website.latestMeasurement?.title}
                          </h3>
                          <span className="text-gray-400 text-xs">
                            {website.latestMeasurement?.redirect ||
                              website.latestMeasurement?.url}
                          </span>
                        </div>
                      </div>
                      {website.latestMeasurement?.description && (
                        <p className="max-w-full h-fit overflow-y-auto overflow-x-hidden text-ellipsis">
                          {website.latestMeasurement.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="hidden h-full md:flex flex-col gap-2 md:gap-4 mt-2 md:mt-0 md:p-4">
                      <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <div className=" max-w-full flex items-center gap-4">
                          {website.latestMeasurement?.icon ? (
                            <img
                              src={website.latestMeasurement.icon}
                              alt={`${website.host} icon`}
                              className="w-[32px] h-[32px]"
                            />
                          ) : (
                            <div className="w-[32px] h-[32px] text-muted-foreground/10 flex justify-center items-center rounded-full">
                              <GlobeIcon
                                size={20}
                                className="text-muted-foreground"
                              />
                            </div>
                          )}
                          <div className="max-w-full flex flex-col">
                            <h3 className="max-w-full md:max-w-xs text-lg truncate m-0">
                              {website.latestMeasurement?.title}
                            </h3>
                            <span className="text-gray-400 text-xs">
                              {website.latestMeasurement?.redirect ||
                                website.latestMeasurement?.url}
                            </span>
                          </div>
                        </div>
                        <div className="hidden md:flex flex-col md:items-end gap-1">
                          <StarRating rating={website.rating?.overallScore} />
                          <span className="text-xs text-gray-400">
                            {website.rating
                              ? moment(website.rating.createdAt).fromNow()
                              : 'Not rated yet'}
                          </span>
                        </div>
                      </div>
                      {website.latestMeasurement?.description && (
                        <p className="max-w-full h-fit overflow-y-auto overflow-x-hidden text-ellipsis">
                          {website.latestMeasurement.description}
                        </p>
                      )}
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
