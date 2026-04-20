import { ApolloProvider } from '@apollo/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootPage from './RootPage'
import { client } from './apollo'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotFoundPage } from './pages/Error/404Page'
import DashboardPage from './pages/DashboardPage'
import JobsPage from './pages/JobsPage'
import OptimizationJobPage from './pages/OptimizationJobPage'
import BrowserPage from './pages/BrowserPage'
import BatchPage from './pages/BatchPage'
import AgentPage from './pages/AgentPage'
import AgentCreatePage from './pages/AgentCreatePage'
import DiscoverPage from './pages/DiscoverPage'
import KeywordsOverviewPage from './pages/KeywordsOverviewPage'
import KeywordAuctionPage from './pages/KeywordAuctionPage'
import CollectionsPage from './pages/CollectionsPage'
import CollectionDetailPage from './pages/CollectionDetailPage'
import CollectionSharePage from './pages/CollectionSharePage'
import DomainPage from './pages/DomainPage'
import WalletPage from './pages/WalletPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: 'home',
        element: <DashboardPage />,
      },
      { path: 'batch', element: <BatchPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/:jobId', element: <OptimizationJobPage /> },
      { path: 'browser', element: <BrowserPage /> },
      { path: 'browser/:jobId/:mode', element: <BrowserPage /> },
      { path: 'agent', element: <AgentPage /> },
      { path: 'agent/new', element: <AgentCreatePage /> },
      { path: 'agent/:sessionId', element: <AgentPage /> },
      { path: 'discover', element: <DiscoverPage /> },
      { path: 'keywords', element: <KeywordsOverviewPage /> },
      { path: 'keywords/:jobId', element: <KeywordAuctionPage /> },
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'collections/:id', element: <CollectionDetailPage /> },
      { path: 'collections/share/:slug', element: <CollectionSharePage /> },
      { path: 'domain/:domain', element: <DomainPage /> },
      { path: 'wallet', element: <WalletPage /> },
    ],
    errorElement: <NotFoundPage />,
  },
])

function App() {
  return (
    <ThemeProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </ThemeProvider>
  )
}

export default App
