import Pricetag from '@/components/Pricetag'
import { SearchWebsite } from '@/components/ui/search-website'
import { useCreateMeasure } from '@/hooks/useCreateMeasure'
import { useWalletOrAccLogin } from '@/hooks/useWalletOrAccLogin'
import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  ConnectionType,
  DeviceType,
  useMeasurementsLazyQuery
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MeasurePageProps {}

const MeasurePage: React.FC<MeasurePageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const [measurementsQuery] = useMeasurementsLazyQuery()
  const { createMeasure } = useCreateMeasure({
    url: '',
  })
  const { isConnected, login } = useWalletOrAccLogin()

  const search = useCallback(
    (url: string) => {
      if (!isConnected) {
        login()
      } else {
        const urlObj = new URL(url)
        measurementsQuery({ variables: { url } })
          .then(async (response) => {
            if (!response.error && !response.data?.measurements?.length) {
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
    [createMeasure, isConnected, login, measurementsQuery, navigate]
  )

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full mt-16 flex flex-col items-center">
        <h1 className="max-w-4xl text-white text-center text-6xl font-bold leading-16 mb-8">
          Measure and optimize the performance of your website
        </h1>
        <SearchWebsite
          type="search"
          prefix="https://"
          size={24}
          initial={params.get('url') || ''}
          onSearch={search}
          className="w-xl mb-4"
        />
        <Pricetag />
        <div className="max-w-xl flex flex-wrap justify-center gap-2 mt-2 p-4">
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
        className="inset absolute top-0 w-[calc(100vw-256px)] z-[-1] bg-muted h-screen overflow-hidden"
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
