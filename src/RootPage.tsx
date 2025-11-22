import {
  Github,
  HomeIcon,
  LogOutIcon,
  PackageIcon,
  SearchIcon,
  TypeIcon,
} from 'lucide-react'
import { useEffect, type JSX } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'
import { useLoggedInQuery } from '../generated/graphql'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from './components/blocks/sidebar'
import LogoSilhouette from './components/icons/logoSilhouette'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'

interface SidebarItem {
  title: string
  url: string
  icon: JSX.Element
}

const items: SidebarItem[] = [
  {
    title: 'Home',
    url: '/home',
    icon: <HomeIcon />,
  },
  {
    title: 'Search',
    url: '/search',
    icon: <SearchIcon />,
  },
  {
    title: 'Libraries',
    url: '/libraries',
    icon: <PackageIcon />,
  },
  {
    title: 'Fonts',
    url: '/fonts',
    icon: <TypeIcon />,
  },
]

const RootPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: loggedInQueryData } = useLoggedInQuery()

  useEffect(() => {
    if (loggedInQueryData?.loggedIn?.verified === false) {
      navigate('/auth/verify')
    }
    hideSplashScreen()
  }, [
    loggedInQueryData?.loggedIn,
    loggedInQueryData?.loggedIn?.verified,
    navigate,
  ])

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="min-w-[256px]">
        <SidebarContent>
          <SidebarGroup>
            <img src="/turbine-wordmark.png" width="120px" className="mb-2" />
            <Separator className="mb-2" />
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      {item.url.startsWith('/') ? (
                        <Link to={item.url}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <a href={item.url}>
                          {item.icon}
                          <span>{item.title}</span>
                        </a>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {loggedInQueryData?.loggedIn ? (
              <div className="bg-white border rounded-lg p-4 flex justify-between items-center mt-4 mb-2">
                <div className="flex flex-col">
                  <p className="text-sm font-bold">
                    {loggedInQueryData?.loggedIn.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {loggedInQueryData?.loggedIn.email}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate('/auth/logout', { replace: true })}
                >
                  <LogOutIcon width={16} className="text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  className="bg-green-600 hover:bg-green-700 mt-4"
                  onClick={() => {
                    navigate('/auth/login')
                  }}
                >
                  Log in
                </Button>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    navigate('/auth/signup')
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="mb-2 text-muted-foreground"
                onClick={() =>
                  window.open('https://utopiancontributors.com', '_blank')
                }
              >
                <LogoSilhouette />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="mb-2 text-muted-foreground"
                onClick={() =>
                  window.open(
                    'https://github.com/utopian-contributors/turbine',
                    '_blank'
                  )
                }
              >
                <Github width="1.1rem" height="1.1rem" />
              </Button>
            </div>
            <span className="text-xs text-gray-300">
              © {new Date().getFullYear()} Utopian Contributors
            </span>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 min-w-100vh">
        <div className="p-6 max-h-screen max-w-[calc(100vw-256px)] overflow-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default RootPage
