import { LoaderCircleIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { LoggedInDocument, useLogoutMutation } from '../../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LogoutProps {}

const Logout: React.FC<LogoutProps> = () => {
  const navigate = useNavigate()
  const [logout] = useLogoutMutation({
    refetchQueries: [LoggedInDocument],
    onCompleted: () => {
      navigate('/', { replace: true })
      window.location.reload()
    },
  })

  useEffect(() => {
    logout()
  }, [logout])

  return (
    <div>
      <title>Logging out...</title>
      <div className="flex items-center justify-center mt-20 text-lg">
        <LoaderCircleIcon className="animate-spin mr-2 inline-block" />
        <p>Logging you out...</p>
      </div>
    </div>
  )
}

export default Logout
