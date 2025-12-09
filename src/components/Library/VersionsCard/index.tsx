import { Card, CardContent } from '@/components/ui/card'
import { ChartBarLabelCustom } from '@/components/ui/chart-bar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { filesize } from 'filesize'
import type {
  useToggleIntegrateVersionMutation,
  VersionIntegrationsQuery,
  VersionUsageQuery,
} from 'generated/graphql'
import React from 'react'
import VersionConfig from '../VersionConfig'

interface VersionsCardProps {
  toggleIntegrateVersion: ReturnType<
    typeof useToggleIntegrateVersionMutation
  >[0]
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
      <Tabs defaultValue="popular">
        <CardContent>
          <TabsList className="mb-2">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
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
                description="Top 10 versions by bandwidth usage in the last week"
                data={usage.map((stat) => ({
                  label: stat.version,
                  value: Number(stat.bandwidth),
                  formattedValue: filesize(Number(stat.bandwidth)),
                  fill: stat.integrated
                    ? 'var(--color-green-500)'
                    : 'var(--color-gray-500)',
                }))}
                config={{
                  value: {
                    label: 'Bandwidth',
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
