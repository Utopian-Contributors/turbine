import {
  Compass,
  Library,
  LogOut,
  MessageSquare,
  Monitor,
  Moon,
  Search,
  Sun,
  Tag,
  Terminal,
  Wallet,
  Zap,
} from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'
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
  useSidebar,
} from './components/blocks/sidebar'
import { Button } from './components/ui/button'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'
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
  {
    title: 'Browser',
    members: [
      {
        title: 'Search',
        url: '/browser',
        icon: (selected: boolean) => (
          <Search
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
      {
        title: 'Discover',
        url: '/discover',
        icon: (selected: boolean) => (
          <Compass
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
    ],
  },
  {
    title: 'Robot',
    members: [
      {
        title: 'Terminal',
        url: '/home',
        icon: (selected: boolean) => (
          <Terminal
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
      {
        title: 'Agent',
        url: '/agent',
        icon: (selected: boolean) => (
          <MessageSquare
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
      {
        title: 'Jobs',
        url: '/jobs',
        icon: (selected: boolean) => (
          <Zap
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
    ],
  },
  {
    title: 'Account',
    members: [
      {
        title: 'Collections',
        url: '/collections',
        icon: (selected: boolean) => (
          <Library
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
      {
        title: 'Keywords',
        url: '/keywords',
        icon: (selected: boolean) => (
          <Tag
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
      {
        title: 'Wallet',
        url: '/wallet',
        icon: (selected: boolean) => (
          <Wallet
            className={
              selected ? 'text-green-400' : 'text-sidebar-foreground/60'
            }
          />
        ),
      },
    ],
  },
]

const tabBarItems: SidebarItem[] = [
  {
    title: 'Terminal',
    url: '/home',
    icon: (selected: boolean) => (
      <Terminal className={selected ? 'text-green-600' : 'text-gray-500'} />
    ),
  },
  {
    title: 'Jobs',
    url: '/jobs',
    icon: (selected: boolean) => (
      <Zap className={selected ? 'text-green-600' : 'text-gray-500'} />
    ),
  },
  {
    title: 'Collections',
    url: '/collections',
    icon: (selected: boolean) => (
      <Library className={selected ? 'text-green-600' : 'text-gray-500'} />
    ),
  },
  {
    title: 'Wallet',
    url: '/wallet',
    icon: (selected: boolean) => (
      <Wallet className={selected ? 'text-green-600' : 'text-gray-500'} />
    ),
  },
]

const THEME_OPTIONS = [
  { pref: 'system', Icon: Monitor },
  { pref: 'light', Icon: Sun },
  { pref: 'dark', Icon: Moon },
] as const

function ThemeSwitch() {
  const { state } = useSidebar()
  const { themePreference, setThemePreference } = useTheme()
  const collapsed = state === 'collapsed'

  if (collapsed) {
    const currentIndex = THEME_OPTIONS.findIndex(
      (o) => o.pref === themePreference,
    )
    const { Icon } = THEME_OPTIONS[currentIndex] ?? THEME_OPTIONS[1]
    const nextPref =
      THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length].pref
    return (
      <button
        className="w-7 h-7 flex items-center justify-center rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/8 transition-colors"
        onClick={() => setThemePreference(nextPref)}
      >
        <Icon size={14} />
      </button>
    )
  }

  return (
    <div
      className="flex items-center rounded-full p-0.5 gap-0"
      style={{
        background: 'rgba(0,0,0,0.25)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
      }}
    >
      {THEME_OPTIONS.map(({ pref, Icon }) => {
        const active = themePreference === pref
        return (
          <button
            key={pref}
            className={cn(
              'w-7 h-6 flex items-center justify-center rounded-full transition-all duration-150',
              active
                ? 'text-sidebar-foreground'
                : 'text-sidebar-foreground/30 hover:text-sidebar-foreground/60',
            )}
            style={
              active
                ? {
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.08) 100%)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,.15), 0 1px 3px rgba(0,0,0,.4)',
                  }
                : undefined
            }
            onClick={() => setThemePreference(pref)}
          >
            <Icon size={13} />
          </button>
        )
      })}
    </div>
  )
}

const RootPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isBrowserPage = location.pathname.startsWith('/browser')
  const [sidebarOpen, setSidebarOpen] = useState(!isBrowserPage)

  useEffect(() => {
    setSidebarOpen(!isBrowserPage)
  }, [isBrowserPage])

  useEffect(() => {
    hideSplashScreen()
  }, [])

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home', { replace: true })
    }
  }, [location, navigate])

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar
        collapsible="icon"
        className={cn('braun-housing', sidebarOpen ? 'min-w-60' : 'w-fit')}
        style={
          {
            '--sidebar': 'transparent',
            boxShadow:
              'inset -1px 0 0 rgba(255,255,255,.03), 2px 0 12px rgba(0,0,0,.35)',
          } as React.CSSProperties
        }
      >
        <SidebarContent className="gap-0 group-data-[collapsible=icon]:w-fit">
          {/* Product nameplate */}
          <SidebarGroup
            className="h-[57px] flex flex-row items-center mb-0 px-3 py-4 group-data-[collapsible=icon]:w-fit"
            style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}
          >
            <Link
              to="/home"
              className="flex-1 flex items-center gap-3 group-data-[collapsible=icon]:w-fit"
            >
              <img
                src="/utopian-icon-64.svg"
                alt="Utopian"
                className="w-6 h-6 shrink-0"
              />
              <h1
                className="text-[15px] font-light uppercase text-sidebar-foreground overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300 ease-in-out group-data-[collapsible=icon]:hidden"
                style={{ letterSpacing: '0.14em', opacity: 0.85 }}
              >
                Utopian
              </h1>
            </Link>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'w-7 h-7 text-sidebar-foreground/35 hover:text-red-500 hover:bg-white/5',
                  sidebarOpen ? '' : 'hidden',
                )}
                onClick={logout}
              >
                <LogOut width="0.85rem" height="0.85rem" />
              </Button>
            )}
          </SidebarGroup>

          {groups.map((group) => (
            <SidebarGroup className="px-0 py-0 mt-4" key={group.title}>
              {/* Engraved section divider — hidden when icon-only */}
              <div className="flex items-center gap-2.5 px-4 mb-1.5 h-[12.75px]">
                <span
                  className="text-[8.5px] font-medium uppercase overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0"
                  style={{
                    color: 'rgba(255,255,255,.32)',
                    letterSpacing: '0.18em',
                    textShadow: '0 1px 0 rgba(0,0,0,.4)',
                  }}
                >
                  {group.title}
                </span>
              </div>
              <SidebarGroupContent>
                <SidebarMenu className="gap-px px-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-fit">
                  {group.members.map((item) => {
                    const selected = location.pathname.startsWith(item.url)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={cn(
                            'px-2 py-2 rounded-md gap-2 group-data-[collapsible=icon]:justify-center',
                            selected
                              ? 'text-sidebar-foreground'
                              : 'text-sidebar-foreground/45 hover:text-sidebar-foreground/75',
                          )}
                          style={{
                            fontSize: '12.5px',
                            fontWeight: selected ? 500 : 400,
                            letterSpacing: '0.01em',
                            transition:
                              'background .12s ease, color .12s ease, box-shadow .12s ease',
                            background: selected
                              ? 'linear-gradient(180deg, rgba(255,255,255,.11) 0%, rgba(255,255,255,.04) 60%, rgba(0,0,0,.05) 100%)'
                              : 'transparent',
                            boxShadow: selected
                              ? 'inset 0 1px 0 rgba(255,255,255,.10), inset 0 -1px 0 rgba(0,0,0,.18), 0 1px 4px rgba(0,0,0,.28)'
                              : 'none',
                            border:
                              '1px solid ' +
                              (selected
                                ? 'rgba(255,255,255,.08)'
                                : 'transparent'),
                          }}
                        >
                          <Link to={item.url}>
                            {item.icon(selected)}
                            <span className="overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300 ease-in-out group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
          <SidebarGroup className="px-3 pl-1 py-3 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
            <div className="flex items-center gap-1.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
              <ThemeSwitch />
              <span
                className="text-[9px] uppercase ml-auto overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0"
                style={{
                  color: 'rgba(255,255,255,.16)',
                  letterSpacing: '0.1em',
                }}
              >
                &copy; {new Date().getFullYear()} Utopian
              </span>
            </div>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <div className="lg:hidden fixed w-[calc(100vw-64px)] bottom-6 z-10 left-1/2 transform -translate-x-1/2 bg-card/80 ring ring-border backdrop-blur rounded-full shadow-lg flex">
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
                  selected ? 'bg-green-100' : '',
                )}
              >
                {item.icon(selected)}
              </div>
            </div>
          )
        })}
      </div>

      <main className="flex-1 min-w-0">
        <div className="max-h-screen overflow-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>

    </SidebarProvider>
  )
}

export default RootPage
