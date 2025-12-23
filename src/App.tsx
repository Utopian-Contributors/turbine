import { ApolloProvider } from '@apollo/client'
import { AddressType, lightTheme, PhantomProvider } from '@phantom/react-sdk'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
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
import ImageConversionPage from './pages/ImageConversionPage'
import LibrariesPage from './pages/LibrariesPage'
import LibraryPage from './pages/LibraryPage'
import MeasurePage from './pages/MeasurePage'
import MeasurementsPage from './pages/MeasurementsPage'
import PaymentsPage from './pages/PaymentsPage'
import SearchPage from './pages/SearchPage'
import WebsitesPage from './pages/WebsitesPage'

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
      { path: '/websites', element: <WebsitesPage /> },
      { path: '/payments', element: <PaymentsPage /> },
      {
        path: 'measurements/:host/',
        element: <MeasurementsPage />,
      },
      { path: '/measurements/:host/images', element: <ImageConversionPage /> },
      {
        path: 'measure',
        element: <MeasurePage />,
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
    <PhantomProvider
      config={{
        providers: ['google', 'apple', 'injected'], // Enabled auth methods
        appId: '929ccc32-7429-4797-8b04-513e32f5c017',
        addressTypes: [
          AddressType.ethereum,
          AddressType.solana,
          AddressType.bitcoinSegwit,
          AddressType.sui,
        ],
        authOptions: {
          redirectUrl: 'http://localhost:3000/wallet/callback', // Must be whitelisted in Phantom Portal
        },
      }}
      theme={lightTheme}
      appIcon=""
      appName="Turbine"
    >
      <RecoilRoot>
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </RecoilRoot>
    </PhantomProvider>
  )
}

export default App
