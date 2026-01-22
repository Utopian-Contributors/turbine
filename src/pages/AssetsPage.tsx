import { FavoritesTab } from '@/components/Assets/FavoritesTab'
import { NativePackagesTab } from '@/components/Assets/NativePackagesTab'
import { TopPackagesTab } from '@/components/Assets/TopPackagesTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flame, Hammer, SearchIcon, Star } from 'lucide-react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchPage from './SearchPage'

const VALID_TABS = ['search', 'top', 'native', 'favorites'] as const
type TabValue = (typeof VALID_TABS)[number]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AssetsPageProps {}

const AssetsPage: React.FC<AssetsPageProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const currentTab: TabValue = VALID_TABS.includes(tabParam as TabValue)
    ? (tabParam as TabValue)
    : 'search'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <div>
      <Tabs value={currentTab} onValueChange={handleTabChange} className="px-6 py-4">
        <TabsList className='grid grid-cols-4 gap-2'>
          <TabsTrigger value="search">
            <SearchIcon />
            Search
          </TabsTrigger>
          <TabsTrigger value="top">
            <Flame />
            Top
          </TabsTrigger>
          <TabsTrigger value="native">
            <Hammer />
            Native
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star />
            Favorites
          </TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <SearchPage />
        </TabsContent>
        <TabsContent value="top">
          <TopPackagesTab />
        </TabsContent>
        <TabsContent value="native">
          <NativePackagesTab />
        </TabsContent>
        <TabsContent value="favorites">
          <FavoritesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AssetsPage
