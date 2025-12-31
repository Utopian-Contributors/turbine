import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { AccordionItem } from '@radix-ui/react-accordion'
import React, { useEffect } from 'react'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { filesize } from 'filesize'
import { toHeaderCase } from 'js-convert-case'
import { useNavigate } from 'react-router'
import {
  ReleasesDocument,
  useCreateReleaseMutation,
  useNewReleaseQuery,
  usePotentialSavingsQuery,
} from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NewReleasePageProps {}

const NewReleasePage: React.FC<NewReleasePageProps> = () => {
  const navigate = useNavigate()
  const { data: newReleaseQueryData } = useNewReleaseQuery()
  const { data: potentialSavingsQueryData } = usePotentialSavingsQuery()
  const [createRelease] = useCreateReleaseMutation({
    refetchQueries: [{ query: ReleasesDocument }],
    onCompleted: () => {
      navigate('/releases')
    },
  })

  useEffect(() => {
    document.title = 'Turbine | New Release'
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">New Release</h1>
        <Button onClick={() => createRelease()}>Create</Button>
      </div>
      <Separator className="my-6" />
      <div className="flex gap-4 mt-6">
        <Card className="p-6">
          <h4>Potential NPM Savings (weekly)</h4>
          <span className="text-3xl font-light">
            {filesize(
              potentialSavingsQueryData?.potentialSavings
                ?.totalVersionSavings ?? 0
            )}
          </span>
        </Card>
        <Card className="p-6">
          <h4>Potential CDN Savings (weekly)</h4>
          <span className="text-3xl font-light">
            {filesize(
              potentialSavingsQueryData?.potentialSavings?.totalFileSavings ?? 0
            )}
          </span>
        </Card>
      </div>
      <Accordion type="multiple" className="mt-6">
        <AccordionItem value="newLibraries">
          <AccordionTrigger className="mx-1">
            <h2 className="text-xl font-light">Libraries</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pb-0">
            {newReleaseQueryData?.newRelease?.newLibraries?.map((library) => (
              <div
                key={library.id}
                onClick={() => {
                  navigate('/l/' + library.name)
                }}
                className="cursor-pointer hover:shadow-md border rounded-md mx-1 p-4"
              >
                <h3 className="text-lg font-medium">{library.name}</h3>
                <p className="text-sm text-gray-500">{library.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {library.newVersions?.map((version) => (
                    <div
                      key={version.id}
                      className="rounded-md bg-green-100 px-2 py-1"
                    >
                      {version.version}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {newReleaseQueryData?.newRelease?.libraries?.map((library) => (
              <div
                key={library.id}
                onClick={() => {
                  navigate('/l/' + library.name)
                }}
                className="cursor-pointer opacity-50 hover:opacity-100 hover:shadow-md border rounded-md mx-1 p-4"
              >
                <h3 className="text-lg font-medium">{library.name}</h3>
                <p className="text-sm text-gray-500">{library.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {library.releasedVersions?.map((version) => (
                    <div
                      key={version.id}
                      className="rounded-md bg-gray-100 px-2 py-1"
                    >
                      {version.version}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        {newReleaseQueryData?.newRelease?.newFiles?.length || newReleaseQueryData?.newRelease?.files?.length ? (
          <AccordionItem value="newFiles">
            <AccordionTrigger className="mx-1">
              <h2 className="text-xl font-light">Files</h2>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pb-0">
              {newReleaseQueryData?.newRelease?.newFiles?.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    navigate('/l/' + file.version.library.name)
                  }}
                  className="hover:shadow-md border rounded-md mx-1 p-4"
                >
                  <h3 className="text-lg font-medium">
                    {file.version.library.name}
                  </h3>
                  <p className="text-sm text-gray-500">{file.path}</p>
                  <div className="w-fit rounded-md bg-green-100 px-2 py-1 mt-2">
                    {file.version.version}
                  </div>
                </div>
              ))}
              {newReleaseQueryData?.newRelease?.files?.map((file) => (
                <div
                  key={file.id}
                  className="opacity-50 hover:opacity-100 hover:shadow-md border rounded-md mx-1 p-4"
                >
                  <h3 className="text-lg font-medium">
                    {file.version.library.name}
                  </h3>
                  <p className="text-sm text-gray-500">{file.path}</p>
                  <div className="w-fit rounded-md bg-gray-100 px-2 py-1 mt-2">
                    {file.version.version}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {newReleaseQueryData?.newRelease?.newFonts?.length ? (
          <AccordionItem value="newFonts">
            <AccordionTrigger className="mx-1">
              <h2 className="text-xl font-light">Fonts</h2>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pb-0">
              {newReleaseQueryData?.newRelease?.newFonts?.map((font) => {
                const fontFace = `
                  @font-face {
                    font-family: "${font.name}-menu";
                    src: url("${font.menu}");
                    font-display: block;
                  }
                `

                return (
                  <div
                    key={font.id}
                    onClick={() => {
                      navigate('/fonts/' + font.name)
                    }}
                    className="hover:shadow-md border rounded-md mx-1 mb-4 p-4"
                  >
                    <style>{fontFace}</style>
                    <h3
                      className="text-xl mb-4"
                      style={{ fontFamily: `${font.name}-menu` }}
                    >
                      {font.name}
                    </h3>
                    <span
                      key="category"
                      className="h-[fit-content] bg-white border border-gray-200 px-2 py-1 rounded-sm text-xs text-muted-foreground"
                    >
                      {toHeaderCase(font.category)}
                    </span>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>
    </div>
  )
}

export default NewReleasePage
