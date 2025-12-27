import React from 'react'

import PreloadImage from '@/components/ui/preload-image-cover'
import StarRating from '@/components/ui/StarRating'
import { GlobeIcon } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router'
import { useWebsitesQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WebsitesPageProps {}

const WebsitesPage: React.FC<WebsitesPageProps> = () => {
  const navigate = useNavigate()
  const { data: websitesQueryData } = useWebsitesQuery()

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">Websites</h1>
        <div className="flex flex-col gap-4 mt-6">
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
                  className="cursor-pointer flex gap-2 overflow-hidden"
                >
                  {website.latestMeasurement?.thumbnail && (
                    <div className="mx-1 my-2 min-w-64 border rounded-lg overflow-hidden">
                      <PreloadImage
                        src={website.latestMeasurement?.thumbnail}
                        className="h-40 w-full bg-cover bg-center"
                      >
                        {(error) =>
                          error && (
                            <div className="h-40 w-full bg-gradient-to-b from-green-500 to-green-500/5" />
                          )
                        }
                      </PreloadImage>
                    </div>
                  )}
                  <div className="w-full ">
                    <div className="h-full flex flex-col gap-4 p-4">
                      <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-4">
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
                          <div className="flex flex-col">
                            <h3 className="w-xs text-lg truncate m-0">
                              {website.latestMeasurement?.title}
                            </h3>
                            <span className="text-gray-400 text-xs">
                              {website.latestMeasurement?.redirect ||
                                website.latestMeasurement?.url}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
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
