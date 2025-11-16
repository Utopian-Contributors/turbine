import { useParams } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LibraryPageProps {}

const LibraryPage: React.FC<LibraryPageProps> = () => {
  const params = useParams<{ name: string }>()
  return <div>{params.name}</div>
}

export default LibraryPage
