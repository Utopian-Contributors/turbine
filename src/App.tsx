import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootPage from './RootPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import SearchPage from './pages/SearchPage';

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
        path: 'projects',
        element: <ProjectsPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
