import {
    ApolloClient,
    ApolloLink,
    gql,
    HttpLink,
    InMemoryCache,
    Observable,
} from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  credentials: 'include',
})

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = localStorage.getItem('access_token')

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })

  // Call the next link in the middleware chain.
  return forward(operation)
})

const generateRefreshTokenLinkOnUnauthError = ({
  refreshTokenRequestFunc,
}: {
  refreshTokenRequestFunc: () => Promise<void>
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ErrorLink((errorResponse: any) => {
    const { graphQLErrors, operation, forward } = errorResponse
    if (!graphQLErrors) return

    for (const { extensions } of graphQLErrors) {
      if (extensions?.code !== 'NOT_LOGGED_IN') continue

      // Refresh token and retry the operation
      return new Observable((observer) => {
        refreshTokenRequestFunc()
          .then(() => {
            // Retry the operation after refreshing the token
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            }
            forward(operation).subscribe(subscriber)
          })
          .catch((error) => {
            observer.error(error)
          })
      })
    }
  })
}

const REFRESH_TOKEN_MUTATION = gql`
  mutation {
    refreshToken {
      id
      name
      email
      accessToken
      verified
    }
  }
`

const getNewToken = (): Promise<void> => {
  return client
    .mutate({ mutation: REFRESH_TOKEN_MUTATION, awaitRefetchQueries: true })
    .then((response) => {
      const accessToken = (
        response.data as { refreshToken: { accessToken: string } }
      ).refreshToken.accessToken
      if (accessToken) localStorage.setItem('access_token', accessToken)
    })
    .catch((error: Error) => {
      console.error('Error refreshing token:', error)
    })
}

export const client = new ApolloClient({
  link: ApolloLink.from([
    generateRefreshTokenLinkOnUnauthError({
      refreshTokenRequestFunc: getNewToken,
    }),
    authLink,
    httpLink,
  ]),
  cache: new InMemoryCache(),
  devtools: { enabled: true },
})
