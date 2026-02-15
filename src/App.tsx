import { ApolloProvider } from '@apollo/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootPage from './RootPage'
import { client } from './apollo'
import { NotFoundPage } from './pages/Error/404Page'
import ImageConversionPage from './pages/ImageConversionPage'
import LocalImageConversionPage from './pages/LocalImageConversionPage'
import MeasurePage from './pages/MeasurePage'
import MeasurementsPage from './pages/MeasurementsPage'
import PathHistoryPage from './pages/PathHistoryPage'
import RatingsPage from './pages/RatingsPage'
import WebsitesPage from './pages/WebsitesPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: 'home',
        element: <MeasurePage />,
      },
      { path: '/websites', element: <WebsitesPage /> },
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
    ],
    errorElement: <NotFoundPage />,
  },
])

function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  )
}

export default App
