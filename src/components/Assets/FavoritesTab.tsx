import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LibraryListItem } from '@/components/Library/LibraryListItem'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  useLoggedInQuery,
  useStarredLibrariesQuery,
} from '../../../generated/graphql'

export function FavoritesTab() {
  const { data: loggedInData } = useLoggedInQuery()
  const { data, loading } = useStarredLibrariesQuery({
    skip: !loggedInData?.loggedIn,
  })

  const isLoggedIn = !!loggedInData?.loggedIn

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="text-center py-16">
        <Star className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500">
          Log in to save favorites
        </h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Create an account or log in to star your favorite packages and access
          them quickly from this page.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button asChild>
            <Link to="/auth/login">Log In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    )
  }

  // Logged in but no favorites
  if (!data?.starredLibraries?.length) {
    return (
      <div className="text-center py-16">
        <Star className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500">No favorites yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Star packages from search results or the Top Packages tab to see them
          here.
        </p>
      </div>
    )
  }

  // Has favorites
  return (
    <div className="max-w-2xl mx-auto pt-6">
      <div className="flex flex-col gap-1">
        {data.starredLibraries.map((library, index) => (
          <div key={library.id}>
            <LibraryListItem library={library} />
            {index < data.starredLibraries!.length - 1 && (
              <Separator className="bg-muted my-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
