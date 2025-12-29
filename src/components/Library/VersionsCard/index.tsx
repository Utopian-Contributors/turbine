import { Card, CardContent } from '@/components/ui/card'
import { ChartBarLabelCustom } from '@/components/ui/chart-bar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  VersionIntegrationsQuery,
  VersionUsageQuery
} from 'generated/graphql'
import { abbreviateNumber } from 'js-abbreviation-number'
import React from 'react'
import VersionConfig from '../VersionConfig'

interface VersionsCardProps {
  toggleIntegrateVersion: (version: string) => void
  integrations: VersionIntegrationsQuery['versionIntegrations']
  usage: VersionUsageQuery['versionUsage']
  isAdmin: boolean
}

const VersionsCard: React.FC<VersionsCardProps> = ({
  toggleIntegrateVersion,
  integrations,
  usage,
  isAdmin,
}) => {
  return (
    <Card className="bg-gradient-to-t from-primary/2 to-card border rounded-xl">
      <Tabs defaultValue="stats">
        <CardContent>
          <TabsList className="mb-2">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
          <TabsContent value="popular">
            <VersionConfig
              toggleIntegrateVersion={toggleIntegrateVersion}
              isAdmin={isAdmin}
              versionConfig={integrations}
            />
          </TabsContent>
          <TabsContent value="stats">
            {usage ? (
              <ChartBarLabelCustom
                description="Top 10 versions by npm downloads in the last week"
                data={[...usage]
                  .sort((a, b) => Number(b.downloads) - Number(a.downloads))
                  .map((stat) => ({
                    label: stat.version,
                    value: Number(stat.downloads),
                    formattedValue: abbreviateNumber(Number(stat.downloads)),
                    fill: stat.integrated
                      ? 'var(--color-green-500)'
                      : 'var(--color-gray-500)',
                  }))}
                config={{
                  value: {
                    label: 'Downloads',
                    color: 'gray',
                  },
                  label: {
                    color: 'var(--background)',
                  },
                }}
              />
            ) : null}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

export default VersionsCard
