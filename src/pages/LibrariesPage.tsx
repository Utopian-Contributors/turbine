import Search from '@/components/blocks/search'
import { useSearch } from '@/hooks/useSearch'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ProjectsPageProps {}

const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const { search } = useSearch()

  return (
    <div>
      <title>Turbine | Libraries</title>
      <Search onChange={(res) => search(res)} />
    </div>
  )
}

export default ProjectsPage
