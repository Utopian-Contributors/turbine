import { ApolloProvider } from '@apollo/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootPage from './RootPage'
import { client } from './apollo'
import { Auth } from './components/Auth'
import {
  ForgotPasswordPage,
  LoginPage,
  SignupPage,
  VerifyPage,
} from './pages/Auth'
import Logout from './pages/Auth/Logout'
import { NotFoundPage } from './pages/Error/404Page'
import FontPage from './pages/FontPage'
import FontsPage from './pages/FontsPage'
import HomePage from './pages/HomePage'
import LibrariesPage from './pages/LibrariesPage'
import LibraryPage from './pages/LibraryPage'
import SearchPage from './pages/SearchPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'libraries',
        element: <LibrariesPage />,
      },
      {
        path: 'l/:name',
        element: <LibraryPage />,
      },
      {
        path: 'fonts',
        element: <FontsPage />,
      },
      { path: 'fonts/:font', element: <FontPage /> },
    ],
    errorElement: <NotFoundPage />,
  },
  {
    path: 'auth',
    element: <Auth />,
    errorElement: <NotFoundPage />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'verify', element: <VerifyPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  { path: 'auth/logout', element: <Logout /> },
])

function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  )
}

export default App
