import { List } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useLocation, useNavigate } from 'react-router'

import Search from '@/components/blocks/search'
import { WebsitesGrid } from '@/components/WebsitesGrid'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useLoggedInQuery,
  useWebsitesQuery,
  WebsiteHostFilter,
  WebsiteHostQueryOrder,
  type WebsiteHost,
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WebsitesPageProps {}

const renderSelectedOrder = (order: WebsiteHostQueryOrder | null) => {
  switch (order) {
    case WebsiteHostQueryOrder.CreatedAtAsc:
      return 'Oldest'
    case WebsiteHostQueryOrder.CreatedAtDesc:
      return 'Newest'
    case WebsiteHostQueryOrder.HostAsc:
      return 'A-Z'
    case WebsiteHostQueryOrder.HostDesc:
      return 'Z-A'
    default:
      return 'Sort By'
  }
}

const WebsitesPage: React.FC<WebsitesPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  // Read tab from URL, default to 'all'
  const tabParam = searchParams.get('tab')
  const activeTab: 'all' | 'measured' = tabParam === 'measured' ? 'measured' : 'all'

  const [selectedOrder, setSelectedOrder] =
    useState<WebsiteHostQueryOrder | null>(
      searchParams.get('order') as WebsiteHostQueryOrder,
    )
  const [hasMoreWebsites, setHasMoreWebsites] = useState(true)

  const currentFilter = activeTab === 'measured' ? WebsiteHostFilter.MeasuredByMe : null

  const {
    data: websitesQueryData,
    fetchMore: fetchMoreWebsites,
  } = useWebsitesQuery({
    variables: {
      pagination: { take: 12 },
      filter: currentFilter,
      query: searchParams.get('q') || undefined,
      order: selectedOrder,
    },
    fetchPolicy: 'cache-and-network',
  })
  const { data: loggedInQueryData } = useLoggedInQuery()

  useEffect(() => {
    document.title = 'Turbine | Websites'
  }, [])

  // Reset pagination and refetch when tab/filter changes
  useEffect(() => {
    setHasMoreWebsites(true)
  }, [activeTab])

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(location.search)
      if (value === 'all') {
        params.delete('tab')
      } else {
        params.set('tab', value)
      }
      navigate(
        {
          pathname: '/websites',
          search: params.toString(),
        },
        { replace: true },
      )
    },
    [location.search, navigate],
  )

  const loadMoreWebsites = useCallback(() => {
    if (hasMoreWebsites) {
      fetchMoreWebsites({
        variables: {
          pagination: {
            skip: websitesQueryData?.websites?.length,
            take: 10,
          },
          order: selectedOrder,
          filter: activeTab === 'measured' ? WebsiteHostFilter.MeasuredByMe : null,
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
  }, [
    activeTab,
    fetchMoreWebsites,
    hasMoreWebsites,
    selectedOrder,
    websitesQueryData?.websites?.length,
  ])

  const { ref: lastWebsiteRef, inView: lastWebsiteRefInView } = useInView()
  useEffect(() => {
    if (lastWebsiteRefInView && hasMoreWebsites) {
      loadMoreWebsites()
    }
  }, [hasMoreWebsites, lastWebsiteRefInView, loadMoreWebsites])

  // Reset hasMore when filter/search changes
  useEffect(() => {
    setHasMoreWebsites(true)
  }, [location.search, selectedOrder])

  const handleWebsiteClick = useCallback(
    (website: WebsiteHost) => {
      if (
        website.host &&
        (website.rootMeasurement?.url || website.rootMeasurement?.redirect)
      ) {
        navigate(
          `/measurements/${website.host}?path=${
            new URL(
              website.rootMeasurement?.redirect || website.rootMeasurement?.url,
            ).pathname
          }`,
        )
      }
    },
    [navigate],
  )

  return (
    <div className="p-6 pb-40 lg:pb-6">
      <div className="lg:max-w-5xl mx-auto">
        <div className="h-12 sticky flex items-center top-6 z-10 mb-6">
          <Search
            className="w-full lg:w-md lg:ml-32"
            placeholder="Search websites..."
            onChange={(value) => {
              const params = new URLSearchParams(location.search)
              if (value) {
                params.set('q', value)
              } else {
                params.delete('q')
              }
              navigate('/websites?' + params.toString())
            }}
          />
          <Select
            onValueChange={(order) => {
              setSelectedOrder(order as WebsiteHostQueryOrder)
              const search = new URLSearchParams(location.search)
              search.set('order', order)
              navigate(
                {
                  pathname: '/websites',
                  search: search.toString(),
                },
                { replace: true },
              )
            }}
            defaultValue={WebsiteHostQueryOrder.CreatedAtDesc}
          >
            <SelectTrigger className="hidden lg:flex w-32 relative left-0">
              <List size={16} />
              {renderSelectedOrder(selectedOrder)}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WebsiteHostQueryOrder.CreatedAtDesc}>
                Newest
              </SelectItem>
              <SelectItem value={WebsiteHostQueryOrder.CreatedAtAsc}>
                Oldest
              </SelectItem>
              <SelectItem value={WebsiteHostQueryOrder.HostAsc}>A-Z</SelectItem>
              <SelectItem value={WebsiteHostQueryOrder.HostDesc}>
                Z-A
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loggedInQueryData?.loggedIn && (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="measured">Measured by me</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <WebsitesGrid
          key={activeTab}
          websites={(websitesQueryData?.websites as WebsiteHost[]) ?? []}
          onWebsiteClick={handleWebsiteClick}
          lastItemRef={lastWebsiteRef}
        />
      </div>
    </div>
  )
}

export default WebsitesPage
