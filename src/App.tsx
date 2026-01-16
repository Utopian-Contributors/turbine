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
import ImageConversionPage from './pages/ImageConversionPage'
import LocalImageConversionPage from './pages/LocalImageConversionPage'
import LibrariesPage from './pages/LibrariesPage'
import LibraryPage from './pages/LibraryPage'
import MeasurePage from './pages/MeasurePage'
import MeasurementsPage from './pages/MeasurementsPage'
import NewReleasePage from './pages/NewReleasePage'
import PathHistoryPage from './pages/PathHistoryPage'
import PaymentsPage from './pages/PaymentsPage'
import RatingsPage from './pages/RatingsPage'
import ReleasesPage from './pages/ReleasesPage'
import SearchPage from './pages/SearchPage'
import WalletPage from './pages/WalletPage'
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
        element: <MeasurePage />,
      },
      { path: '/websites', element: <WebsitesPage /> },
      { path: '/payments', element: <PaymentsPage /> },
      {
        path: 'measurements/:host/',
        element: <MeasurementsPage />,
      },
      { path: '/measurements/:host/history', element: <PathHistoryPage /> },
      { path: '/measurements/:host/images', element: <ImageConversionPage /> },
      { path: '/images', element: <LocalImageConversionPage /> },
      {
        path: 'measure',
        element: <MeasurePage />,
      },
      { path: '/ratings/:host', element: <RatingsPage /> },
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
      { path: 'releases', element: <ReleasesPage /> },
      { path: 'releases/new', element: <NewReleasePage /> },
      {
        path: 'wallet',
        element: <WalletPage />,
      },
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
          redirectUrl: import.meta.env.DEV
            ? 'http://localhost:3000/'
            : 'https://turbine.utopian.build/wallet/', // Must be whitelisted in Phantom Portal
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
