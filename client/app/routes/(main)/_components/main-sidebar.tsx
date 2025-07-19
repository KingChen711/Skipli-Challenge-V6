import { BookOpen } from 'lucide-react'
import { type ComponentProps } from 'react'
import { Link, useLocation } from 'react-router'
import { Icons } from '~/components/ui/icons'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '~/components/ui/sidebar'

import { useAuth } from '~/contexts/auth-provider'
import { cn } from '~/lib/utils'
import { ERole } from '~/types/models'

const managementRoutes = [
  {
    route: '/lessons',
    label: 'Lessons',
    Icon: (props: { className?: string }) => {
      return <Icons.Instructor {...props} />
    },
    roles: [ERole.INSTRUCTOR]
  },
  {
    route: '/my-lessons',
    label: 'My Lessons',
    Icon: (props: { className?: string }) => {
      return <Icons.Instructor {...props} />
    },
    roles: [ERole.STUDENT]
  },
  {
    route: '/students',
    label: 'Students',
    Icon: (props: { className?: string }) => {
      return <Icons.Student {...props} />
    },
    roles: [ERole.INSTRUCTOR]
  },
  {
    route: '/messages',
    label: 'Messages',
    Icon: (props: { className?: string }) => {
      return <Icons.Message {...props} />
    },
    roles: [ERole.INSTRUCTOR, ERole.STUDENT]
  }
]

export function ManagementSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  //this user will not null because it is already checked in layout
  const { user } = useAuth()
  const location = useLocation()
  const { open } = useSidebar()

  return (
    <Sidebar className='sticky' collapsible='icon' {...props}>
      <SidebarTrigger className='absolute left-full top-8 z-50 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground max-lg:hidden' />

      <SidebarHeader className='flex justify-center pb-0'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              {open ? (
                <Link to='/' className='flex h-full items-center pb-2'>
                  <div className='w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center'>
                    <BookOpen className='w-4 h-4 text-primary-foreground' />
                  </div>
                  <div className='flex flex-col gap-1 text-primary'>
                    <span className='text-base font-semibold leading-none'>LearnHub</span>
                    <span className='text-xs font-semibold leading-none text-muted-foreground'>LearnHub</span>
                  </div>
                </Link>
              ) : (
                <div className='w-4 h-4 shrink-0 bg-primary rounded-lg flex items-center justify-center'>
                  <BookOpen className='w-2 h-2 text-primary-foreground' />
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel> Navigator Bar </SidebarGroupLabel>
          <SidebarMenu>
            {managementRoutes.map((route) => {
              if (!route.roles.includes(user!.role)) {
                return null
              }

              const isActive = location.pathname.startsWith(route.route)

              return (
                <SidebarMenuItem key={route.label}>
                  <SidebarMenuButton tooltip={route.label} asChild isActive={isActive}>
                    <Link to={route.route!}>
                      {route.Icon && <route.Icon className={cn('text-muted-foreground', isActive && 'text-primary')} />}
                      <span className={cn('text-muted-foreground', isActive && 'font-bold text-primary')}>
                        {route.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
