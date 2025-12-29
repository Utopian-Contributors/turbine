import {
  CreditCardIcon,
  Github,
  GlobeIcon,
  LogOutIcon,
  PackageIcon,
  Scale,
  SearchIcon,
  TypeIcon,
} from 'lucide-react'
import { useEffect, type JSX } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
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
import Wallet from './components/Phantom/Wallet'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'
import { useWalletOrAccLogin } from './hooks/useWalletOrAccLogin'
import { cn } from './lib/utils'

interface SidebarItem {
  title: string
  url: string
  icon: (selected: boolean) => JSX.Element
}

const items: SidebarItem[] = [
  // {
  //   title: 'Home',
  //   url: '/home',
  //   icon: (selected: boolean) => (
  //     <HomeIcon className={selected ? 'text-black' : 'text-muted-foreground'} />
  //   ),
  // },
  {
    title: 'Measure',
    url: '/home',
    icon: (selected: boolean) => (
      <Scale className={selected ? 'text-black' : 'text-muted-foreground'} />
    ),
  },
  {
    title: 'Search',
    url: '/search',
    icon: (selected: boolean) => (
      <SearchIcon
        className={selected ? 'text-black' : 'text-muted-foreground'}
      />
    ),
  },
  {
    title: 'Websites',
    url: '/websites',
    icon: (selected: boolean) => (
      <GlobeIcon
        className={selected ? 'text-black' : 'text-muted-foreground'}
      />
    ),
  },

  {
    title: 'Libraries',
    url: '/libraries',
    icon: (selected: boolean) => (
      <PackageIcon
        className={selected ? 'text-black' : 'text-muted-foreground'}
      />
    ),
  },
  {
    title: 'Fonts',
    url: '/fonts',
    icon: (selected: boolean) => (
      <TypeIcon className={selected ? 'text-black' : 'text-muted-foreground'} />
    ),
  },
  {
    title: 'Payments',
    url: '/payments',
    icon: (selected: boolean) => (
      <CreditCardIcon
        className={cn(selected ? 'text-black' : 'text-muted-foreground')}
      />
    ),
  },
]

const RootPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, user, loginRedirect } = useWalletOrAccLogin()

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home', { replace: true })
    }
  }, [location, navigate])

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="hidden md:flex min-w-[256px]">
        <SidebarContent>
          <SidebarGroup>
            <img src="/turbine-wordmark.png" width="120px" className="mb-2" />
            <Separator className="mb-2" />
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        location.pathname.startsWith(item.url)
                          ? 'font-bold'
                          : 'text-muted-foreground'
                      )}
                    >
                      {location.pathname.startsWith(item.url) ? (
                        <Link to={item.url}>
                          {item.icon(true)}
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <Link to={item.url}>
                          {item.icon(false)}
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {isLoggedIn ? (
              <div className="bg-white border rounded-lg p-4 flex justify-between items-center mt-4 mb-2">
                <div className="flex flex-col">
                  <p className="text-sm font-bold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
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
                  className="mt-4"
                  onClick={() => {
                    loginRedirect()
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
          {isLoggedIn && <Wallet />}
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
        <div className="max-h-screen max-w-screen md:max-w-[calc(100vw-256px)] overflow-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default RootPage
