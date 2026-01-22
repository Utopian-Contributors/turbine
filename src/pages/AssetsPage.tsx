import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flame, Hammer, SearchIcon, Star } from 'lucide-react'
import React from 'react'
import SearchPage from './SearchPage'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AssetsPageProps {}

const AssetsPage: React.FC<AssetsPageProps> = () => {
  return (
    <div>
      <Tabs defaultValue="search" className="px-6 py-4">
        <TabsList>
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
      </Tabs>
    </div>
  )
}

export default AssetsPage
