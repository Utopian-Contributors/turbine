import AutoProgress from '@/components/ui/auto-progress'
import { SearchWebsite } from '@/components/ui/search-website'
import { useCreateMeasure } from '@/hooks/useCreateMeasure'
import { useWalletOrAccLogin } from '@/hooks/useWalletOrAccLogin'
import { abbreviateNumber } from 'js-abbreviation-number'
import React, { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  ConnectionType,
  DeviceType,
  useMeasurementsLazyQuery,
  useMeasurementStatsQuery,
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MeasurePageProps {}

const MeasurePage: React.FC<MeasurePageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )

  const { data: measurementStatsQueryData } = useMeasurementStatsQuery()
  const [measurementsQuery] = useMeasurementsLazyQuery({
    fetchPolicy: 'network-only',
  })
  const { createMeasure, isPaying } = useCreateMeasure({
    url: '',
  })
  const { isConnected, isLoggedIn, login } = useWalletOrAccLogin()

  const search = useCallback(
    (url: string) => {
      if (!isConnected || !isLoggedIn) {
        login()
      } else if (url) {
        const urlObj = new URL(url)
        measurementsQuery({
          variables: { host: urlObj.host! },
        })
          .then(async (response) => {
            if (
              !response.error &&
              (!response.data?.measurements?.length ||
                !response.data?.measurements?.some((m) => m.url === url))
            ) {
              await createMeasure({
                url: new URL(urlObj.pathname, `https://${urlObj.host}`).href,
                device: DeviceType.Desktop,
                connection: ConnectionType.Wifi,
              })
            }
          })
          .then(() => {
            navigate(`/measurements/${urlObj.host}?path=` + urlObj.pathname)
          })
      }
    },
    [createMeasure, isConnected, isLoggedIn, login, measurementsQuery, navigate]
  )

  const hero = useMemo(() => {
    const urlParam = searchParams.get('url')
    const hostname = urlParam ? new URL(urlParam).hostname : null
    return hostname ? (
      <div>
        <span className="animate-pulse">
          Measure and optimize the performance of{' '}
        </span>
        <span className="underline">{hostname}</span>
      </div>
    ) : (
      'Measure and optimize the performance of your website'
    )
  }, [searchParams])

  if (isPaying) {
    return (
      <div className="flex flex-col items-center gap-2 my-6 mt-[58px]">
        <div className="text-2xl animate-pulse m-6 text-muted-foreground whitespace-nowrap overflow-hidden">
          Processing payment...
        </div>
        <AutoProgress />
      </div>
    )
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full mt-16 flex flex-col items-center">
        <h1 className="max-w-xs lg:max-w-4xl text-white text-center text-3xl lg:text-6xl font-bold lg:leading-16 mb-8">
          {hero}
        </h1>
        <SearchWebsite
          autoFocus={!!searchParams.get('url')}
          type="search"
          prefix="https://"
          size={24}
          initial={searchParams.get('url') || ''}
          onSearch={search}
          className="w-xs lg:w-xl mb-4"
        />
        {measurementStatsQueryData && (
          <div className="hidden lg:flex gap-2 my-4">
            <div className="w-44 flex flex-col justify-between gap-2 bg-green-600/50 backdrop-blur border border-green-500/50 rounded-md text-white p-4">
              <p className="text-5xl font-thin">
                {abbreviateNumber(
                  measurementStatsQueryData.measurementStats
                    ?.totalWebsiteHosts ?? 0
                )}
              </p>
              <p className="text-md font-bold w-32">Websites measured</p>
            </div>
            <div className="w-44 flex flex-col justify-between gap-2 bg-green-600/50 backdrop-blur border border-green-500/50 rounded-md text-white p-4">
              <p className="text-5xl font-thin">
                {abbreviateNumber(
                  measurementStatsQueryData.measurementStats
                    ?.totalMeasurements ?? 0
                )}
              </p>
              <p className="text-md font-bold w-32">Measurements created</p>
            </div>
            <div className="w-44 flex flex-col justify-between gap-2 bg-green-600/50 backdrop-blur border border-green-500/50 rounded-md text-white p-4">
              <p className="text-5xl font-thin">
                {abbreviateNumber(
                  measurementStatsQueryData.measurementStats
                    ?.totalAccessibilityViolations ?? 0
                )}
              </p>
              <p className="text-md font-bold w-32">
                Accessibility Violations found
              </p>
            </div>
          </div>
        )}
        <div className="max-w-xl flex flex-wrap justify-center gap-2 p-4">
          <span className="border rounded-full border border-green-700 bg-green-600 text-sm text-green-100 px-3 py-1">
            Understand SEO
          </span>
          <span className="border rounded-full border border-green-700 bg-green-600 text-sm text-green-100 px-3 py-1">
            Analyze bundles
          </span>
          <span className="border rounded-full border border-green-700 bg-green-600 text-sm text-green-100 px-3 py-1">
            Compress images
          </span>
          <span className="border rounded-full border border-green-700 bg-green-600 text-sm text-green-100 px-3 py-1">
            Track performance
          </span>
          <span className="border rounded-full border border-green-700 bg-green-600 text-sm text-green-100 px-3 py-1">
            Offload fonts & scripts
          </span>
        </div>
      </div>
      <div
        className="inset absolute top-0 w-full lg:w-[calc(100vw-256px)] z-[-1] bg-muted h-screen overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(50, 205, 50, 0.6), green)',
        }}
      >
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            transform: 'translate(0%, 40%)',
          }}
        />
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: 0.7,
            transform: 'scale(0.5) translate(50%, 80%)',
          }}
        />
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: 0.7,
            transform: 'scale(0.5) translate(-50%, 80%)',
          }}
        />
      </div>
    </div>
  )
}

export default MeasurePage
