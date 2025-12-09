import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  LibraryUsageQuery,
  VersionFilesQuery
} from 'generated/graphql'
import { Check, Copy } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import VersionFileConfig from '../VersionFileConfig'

const generateEmbedUrl = (library: string, version: string, path: string) => {
  return `https://cdn.jsdelivr.net/npm/${library}@${version}/${
    path.startsWith('/') ? path.slice(1) : path
  }`
}

interface VersionFilesCardProps {
  integrations: VersionFilesQuery['versionFileIntegrations']
  usage: LibraryUsageQuery['libraryUsage']
  library: string
  selected?: string | null
  setSelected: (version: string) => void
  isAdmin: boolean
}

const VersionFilesCard: React.FC<VersionFilesCardProps> = ({
  integrations,
  usage,
  library,
  selected,
  setSelected,
  isAdmin,
}) => {
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  const selectedFileEmbedUrl = useMemo(() => {
    const selectedFile = integrations.integrated.find(
      ({ file }) => file.version.version === selected
    )
    if (!library || !selected || !selectedFile) {
      return ''
    }

    return generateEmbedUrl(
      library || '',
      selected,
      selectedFile?.file.path
    )
  }, [integrations.integrated, library, selected])

  return (
    <Card className="bg-gradient-to-t from-primary/2 to-card mt-4">
      <Tabs defaultValue="files">
        <CardContent>
          {integrations.integrated[0]?.file.path && (
            <TabsList className="mb-2">
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="integrate">Integrate</TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="files">
            {integrations && usage?.bandwidth.total ? (
              <VersionFileConfig
                versionFileConfig={integrations}
                totalBandwidth={Number(usage?.bandwidth.total)}
                isAdmin={isAdmin}
              />
            ) : null}
          </TabsContent>
          {integrations.integrated[0]?.file && selectedFileEmbedUrl && (
            <TabsContent value="integrate">
              <Select
                onValueChange={(value) => setSelected(value)}
                defaultValue={integrations.integrated[0].file.version.version}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder="Select Version"
                    className="w-full"
                  />
                </SelectTrigger>
                <SelectContent>
                  {integrations.integrated.map(({ file }) => (
                    <SelectItem key={file.id} value={file.version.version}>
                      <div className="flex gap-1">
                        <span className="text-primary">
                          {file.version.version}
                        </span>
                        <span className="text-muted-foreground">
                          {file.path}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div
                className="cursor-pointer flex flex-col gap-2 group"
                onClick={() => {
                  const embedCode = `<script
  crossorigin
  src="${selectedFileEmbedUrl}"
></script>`
                  navigator.clipboard.writeText(embedCode)
                  setCopiedEmbed(true)
                  setTimeout(() => setCopiedEmbed(false), 2000)
                }}
              >
                <div className="relative flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute right-1 top-3 flex items-center gap-2 transition-colors ${
                      copiedEmbed ? 'text-green-600 hover:text-green-600' : ''
                    }`}
                  >
                    {copiedEmbed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedEmbed ? 'Copied!' : null}
                  </Button>
                </div>
                <pre className="bg-gray-100 group-hover:bg-gray-200 p-4 rounded-md overflow-x-auto text-xs">
                  {`<script
  crossorigin
  src="${selectedFileEmbedUrl}"
></script>`}
                </pre>
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
    </Card>
  )
}

export default VersionFilesCard
