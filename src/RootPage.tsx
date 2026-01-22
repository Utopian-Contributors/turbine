import {
  CreditCardIcon,
  Eye,
  Github,
  Globe,
  ImageIcon,
  LogOutIcon,
  Package,
  Scale,
  Ship,
  WalletIcon,
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
  subpages?: string[]
}

interface SidebarGroupItem {
  title: string
  members: SidebarItem[]
}

const groups: SidebarGroupItem[] = [
  // {
  //   title: 'Home',
  //   url: '/home',
  //   icon: (selected: boolean) => (
  //     <HomeIcon className={selected ? 'text-black' : 'text-muted-foreground'} />
  //   ),
  // },
  {
    title: 'Internet',
    members: [
      {
        title: 'Measure',
        url: '/home',
        icon: (selected: boolean) => (
          <Scale
            className={selected ? 'text-black' : 'text-muted-foreground'}
          />
        ),
      },
      {
        title: 'Websites',
        url: '/websites',
        icon: (selected: boolean) => (
          <Globe
            className={selected ? 'text-black' : 'text-muted-foreground'}
          />
        ),
      },
    ],
  },
  {
    title: 'Technology',
    members: [
      {
        title: 'JavaScript',
        url: '/assets',
        icon: (selected: boolean) => (
          <Package
            className={selected ? 'text-black' : 'text-muted-foreground'}
          />
        ),
      },
      {
        title: 'Releases',
        url: '/releases',
        icon: (selected: boolean) => (
          <Ship className={selected ? 'text-black' : 'text-muted-foreground'} />
        ),
      },
    ],
  },
  {
    title: 'Tools',
    members: [
      {
        title: 'Image Compression',
        url: '/images',
        icon: (selected: boolean) => (
          <ImageIcon
            className={cn(selected ? 'text-black' : 'text-muted-foreground')}
          />
        ),
      },
      {
        title: 'Dynamic Thumbnails',
        url: '/thumbnails',
        icon: (selected: boolean) => (
          <Eye
            className={cn(selected ? 'text-black' : 'text-muted-foreground')}
          />
        ),
      },
    ],
  },
  // {
  //   title: 'Libraries',
  //   url: '/libraries',
  //   icon: (selected: boolean) => (
  //     <PackageIcon
  //       className={selected ? 'text-black' : 'text-muted-foreground'}
  //     />
  //   ),
  // },
  // {
  //   title: 'Fonts',
  //   url: '/fonts',
  //   icon: (selected: boolean) => (
  //     <TypeIcon className={selected ? 'text-black' : 'text-muted-foreground'} />
  //   ),
  // },
  {
    title: 'Account',
    members: [
      {
        title: 'Payments',
        url: '/payments',
        icon: (selected: boolean) => (
          <CreditCardIcon
            className={cn(selected ? 'text-black' : 'text-muted-foreground')}
          />
        ),
      },
    ],
  },
]

const tabBarItems: SidebarItem[] = [
  {
    title: 'Measure',
    url: '/home',
    icon: (selected: boolean) => (
      <Scale className={selected ? 'text-black' : 'text-gray-600'} />
    ),
  },
  {
    title: 'Websites',
    url: '/websites',
    subpages: ['/measurements', '/ratings'],
    icon: (selected: boolean) => (
      <Globe className={selected ? 'text-black' : 'text-gray-600'} />
    ),
  },
  {
    title: 'Wallet',
    url: '/wallet',
    icon: (selected: boolean) => (
      <WalletIcon className={selected ? 'text-black' : 'text-gray-600'} />
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
      <Sidebar collapsible="none" className="hidden lg:flex min-w-[256px]">
        <SidebarContent className="gap-0">
          <SidebarGroup className='mb-1'>
            <img src="/turbine-wordmark.webp" width="120px" className="mb-2" />
            <Separator />
          </SidebarGroup>
          {groups.map((group) => (
            <SidebarGroup className="px-0 py-0 mb-2" key={group.title}>
              <span className="text-xs font-bold uppercase text-gray-200 px-3 mb-1">
                {group.title}
              </span>
              <SidebarGroupContent>
                <SidebarMenu className='gap-0'>
                  {group.members.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={cn(
                          "px-3 rounded-none",
                          location.pathname.startsWith(item.url)
                            ? 'font-bold'
                            : 'text-muted-foreground',
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
            </SidebarGroup>
          ))}

          <SidebarGroup className='py-0'>
            {isLoggedIn ? (
              <div className="bg-white border rounded-lg p-4 flex justify-between items-center mt-2 mb-2">
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
                  Log In
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
                    '_blank',
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

      <div className="lg:hidden fixed w-[calc(100vw-64px)] bottom-6 z-10 left-1/2 transform -translate-x-1/2 bg-white/50 ring ring-gray-300 backdrop-blur rounded-full shadow-lg flex">
        {tabBarItems.map((item) => {
          const selected =
            location.pathname.startsWith(item.url) ||
            Boolean(
              item.subpages &&
              item.subpages.some((subpage) =>
                location.pathname.startsWith(subpage),
              ),
            )
          return (
            <div
              key={item.title}
              className={cn('flex-1 flex justify-center p-2')}
              onClick={() => navigate(item.url)}
            >
              <div
                className={cn(
                  'rounded-full px-8 py-4',
                  selected ? 'bg-gray-100' : '',
                )}
              >
                {item.icon(selected)}
              </div>
            </div>
          )
        })}
      </div>

      <main className="flex-1 min-w-100dvh">
        <div className="max-h-screen max-w-screen lg:max-w-[calc(100vw-256px)] overflow-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default RootPage
