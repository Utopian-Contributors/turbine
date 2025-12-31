import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useLoggedInQuery, useReleasesQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ReleasePageProps {}

const ReleasesPage: React.FC<ReleasePageProps> = () => {
  const navigate = useNavigate()
  const { data } = useReleasesQuery()
  const { data: loggedInQueryData } = useLoggedInQuery()

  useEffect(() => {
    document.title = 'Turbine | Releases'
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Releases</h1>
        {loggedInQueryData?.loggedIn && (
          <Button
            className="flex gap-2"
            onClick={() => navigate('/releases/new')}
          >
            <Plus size={20} />
            New
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-6">
        {!data?.releases?.length && (
          <span className="text-muted-foreground mx-auto">No Releases yet</span>
        )}
        {data?.releases?.map((r) => {
          return (
            <div key={r.id} className="border rounded-md p-6">
              <h2 className="text-xl font-bold mb-2">{r.version}</h2>
              <p>{}</p>
              <div className="flex flex-wrap gap-2">
                {r.integrated?.map((lib) => (
                  <div
                    key={lib?.id}
                    className="bg-gray-100 border rounded-sm text-sm px-3 py-1"
                  >
                    {lib?.name}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReleasesPage
