import {
    Github,
    Globe,
    HomeIcon,
    LayoutGridIcon,
    SearchIcon,
} from 'lucide-react'
import type { JSX } from 'react'
import { Link, Outlet } from 'react-router-dom'
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
    title: 'Projects',
    url: '/projects',
    icon: <LayoutGridIcon />,
  },
]

const RootPage: React.FC = () => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none">
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
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="mb-2 text-muted-foreground"
              >
                <Globe width="1.1rem" height="1.1rem" />
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
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Utopian Contributors
            </span>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 min-w-100vh">
        <div className="p-6 max-h-screen overflow-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default RootPage
