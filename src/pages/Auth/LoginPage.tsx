import React from 'react'

import { useNavigate } from 'react-router'

import { useLoginMutation } from '../../../generated/graphql'
import { Login } from '../../components/Auth'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const [login, loginResult] = useLoginMutation({
    onCompleted: (data, options) => {
      if (data.login?.accessToken) {
        options?.client?.cache.reset()

        // Save the access token to local storage
        localStorage.setItem('access_token', data.login?.accessToken)

        // Redirect to the verify page if the user is not verified
        if (!data.login?.verified) {
          navigate('/auth/verify')
          return
        }

        // Redirect to the previous page or the home page
        const prev = localStorage.getItem('redirect')
        if (prev) {
          localStorage.removeItem('redirect')
          navigate(prev)
        } else {
          navigate('/')
        }
      }
    },
    onError: (error) => console.error(error),
  })

  return (
    <Login
      onSubmit={({ email, password }) => {
        login({ variables: { email, password } })
      }}
      loading={loginResult.loading}
      error={loginResult.error ? 'Ungültige Email oder Passwort' : undefined}
    />
  )
}
