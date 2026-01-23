import { LivePreview } from '@/components/Measurement/LivePreview'
import { LoadingMeasurement } from '@/components/Measurement/Loading'
import AutoProgress from '@/components/ui/auto-progress'
import { Button } from '@/components/ui/button'
import { SearchWebsite } from '@/components/ui/search-website'
import { useCreateMeasure } from '@/hooks/useCreateMeasure'
import { abbreviateNumber } from 'js-abbreviation-number'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  ConnectionType,
  DeviceType,
  MeasurementStatus,
  useLatestMeasurementsQuery,
  useMeasurementStatsQuery,
  useMeasurementStatusLazyQuery,
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MeasurePageProps {}

const MeasurePage: React.FC<MeasurePageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )

  const { data: measurementStatsQueryData } = useMeasurementStatsQuery()
  const { data: latestMeasurementsData } = useLatestMeasurementsQuery({
    pollInterval: 5000, // Refetch every 5 seconds
    fetchPolicy: 'network-only',
  })
  const {
    createMeasure,
    data: createMeasurementData,
    isPaying,
  } = useCreateMeasure({
    url: searchParams.get('url') || undefined,
  })
  const [measurementStatusQuery, { data: measurementStatusData, refetch }] =
    useMeasurementStatusLazyQuery()
  const [pendingMeasurementId, setPendingMeasurementId] = useState<
    string | null
  >(null)

  useEffect(() => {
    if (
      measurementStatusData?.measurement?.status === MeasurementStatus.Pending
    ) {
      const interval = setInterval(() => {
        refetch({ id: pendingMeasurementId! })
      }, 3000)
      return () => clearInterval(interval)
    } else if (
      measurementStatusData?.measurement?.url &&
      measurementStatusData?.measurement?.host?.host
    ) {
      navigate(
        `/measurements/${measurementStatusData?.measurement?.host?.host}?path=` +
          new URL(measurementStatusData?.measurement?.url).pathname,
      )
    } else if (!measurementStatusData?.measurement && pendingMeasurementId) {
      measurementStatusQuery({
        variables: { id: pendingMeasurementId },
      })
    }
  }, [
    measurementStatusData?.measurement,
    measurementStatusData?.measurement?.host?.host,
    measurementStatusData?.measurement?.status,
    measurementStatusData?.measurement?.url,
    measurementStatusQuery,
    navigate,
    pendingMeasurementId,
    refetch,
  ])

  useEffect(() => {
    if (searchParams.get('url')) {
      document.title = `Measure ${new URL(searchParams.get('url')!).hostname}`
    } else {
      document.title = 'Measure your website'
    }
  }, [searchParams])

  const search = useCallback(
    async (url: string) => {
      if (url) {
        const urlObj = new URL(url)
        navigate(`/measure?url=${encodeURIComponent(urlObj.href)}`, {
          replace: true,
        })
        await createMeasure({
          url: new URL(urlObj.pathname, `https://${urlObj.host}`).href,
          device: DeviceType.Desktop,
          connection: ConnectionType.Wifi,
        })
      }
    },
    [createMeasure, navigate],
  )

  useEffect(() => {
    if (
      createMeasurementData?.createMeasurement?.id &&
      createMeasurementData?.createMeasurement?.status ===
        MeasurementStatus.Pending
    ) {
      setPendingMeasurementId(createMeasurementData.createMeasurement.id)
    }
  }, [
    createMeasurementData?.createMeasurement?.id,
    createMeasurementData?.createMeasurement?.status,
  ])

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
        {!pendingMeasurementId ? (
          <h1 className="max-w-xs lg:max-w-4xl text-white text-center text-3xl lg:text-6xl font-bold lg:leading-16 mb-8">
            {hero}
          </h1>
        ) : null}
        {!pendingMeasurementId ? (
          <SearchWebsite
            autoFocus={!!searchParams.get('url')}
            type="search"
            prefix="https://"
            size={24}
            initial={searchParams.get('url') || ''}
            onSearch={search}
            className="w-xs lg:w-xl"
          />
        ) : null}
        {measurementStatusData?.measurement?.status ===
        MeasurementStatus.Pending ? (
          <LoadingMeasurement />
        ) : null}
        {measurementStatusData?.measurement?.status ===
        MeasurementStatus.Failed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl text-red-500 mt-6">
              Measurement failed.
            </div>
            <p className="max-w-xs text-primary text-center">
              This could be because of connection-issues, browser challenges, or
              other unexpected errors with{' '}
              <a
                href={measurementStatusData.measurement.url}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {new URL(measurementStatusData.measurement.url).host}
              </a>
              .
            </p>
            <Button
              variant="outline"
              className="mt-4 mx-auto"
              onClick={() => window.location.reload()}
            >
              Go back
            </Button>
          </div>
        ) : null}
        {measurementStatusData?.measurement?.status !==
          MeasurementStatus.Pending &&
          measurementStatusData?.measurement?.status !==
            MeasurementStatus.Failed &&
          measurementStatsQueryData && (
            <div className="hidden lg:flex gap-2 mt-8 mb-4">
              <div className="w-44 flex flex-col justify-between gap-2 bg-green-600/50 backdrop-blur border border-green-500/50 rounded-md text-white p-4">
                <p className="text-5xl font-thin">
                  {abbreviateNumber(
                    measurementStatsQueryData.measurementStats
                      ?.totalWebsiteHosts ?? 0,
                  )}
                </p>
                <p className="text-md font-bold w-32">Websites measured</p>
              </div>
              <div className="w-44 flex flex-col justify-between gap-2 bg-green-600/50 backdrop-blur border border-green-500/50 rounded-md text-white p-4">
                <p className="text-5xl font-thin">
                  {abbreviateNumber(
                    measurementStatsQueryData.measurementStats
                      ?.totalMeasurements ?? 0,
                  )}
                </p>
                <p className="text-md font-bold w-32">Measurements created</p>
              </div>
              <div className="w-44 flex flex-col justify-between gap-2 bg-green-600/50 backdrop-blur border border-green-500/50 rounded-md text-white p-4">
                <p className="text-5xl font-thin">
                  {abbreviateNumber(
                    measurementStatsQueryData.measurementStats
                      ?.totalAccessibilityViolations ?? 0,
                  )}
                </p>
                <p className="text-md font-bold w-32">
                  Accessibility Violations found
                </p>
              </div>
            </div>
          )}
        {measurementStatusData?.measurement?.status !==
          MeasurementStatus.Pending &&
          measurementStatusData?.measurement?.status !==
            MeasurementStatus.Failed && (
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
          )}
        {!pendingMeasurementId &&
        measurementStatusData?.measurement?.status !==
          MeasurementStatus.Pending &&
        latestMeasurementsData?.latestMeasurements &&
        latestMeasurementsData.latestMeasurements.length > 0 ? (
          <div className="hidden lg:inline w-xl px-4 mt-6">
            <LivePreview
              measurements={latestMeasurementsData.latestMeasurements}
            />
          </div>
        ) : null}
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
            display: pendingMeasurementId ? 'none' : 'block',
          }}
        />
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: 0.7,
            transform: 'scale(0.5) translate(50%, 80%)',
            display: pendingMeasurementId ? 'none' : 'block',
          }}
        />
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: 0.7,
            transform: 'scale(0.5) translate(-50%, 80%)',
            display: pendingMeasurementId ? 'none' : 'block',
          }}
        />
      </div>
    </div>
  )
}

export default MeasurePage
