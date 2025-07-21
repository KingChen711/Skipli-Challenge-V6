import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'

import { SidebarProvider } from '~/components/ui/sidebar'
import { useAuth } from '~/contexts/auth-provider'
import { SocketProvider } from '~/contexts/socket-provider'

import SplashScreen from '~/components/ui/splash-screen'
import ManagementNavbar from './(main)/_components/main-navbar'
import { ManagementSidebar } from './(main)/_components/main-sidebar'

function Layout() {
  const { user, isLoadingAuth } = useAuth()

  const [showLoading, setShowLoading] = useState(true)

  //wait at least 700ms if the user is loading sooner
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [])

  if (isLoadingAuth || showLoading) {
    return <SplashScreen />
  }

  if (!user) {
    return <Navigate to={`/login`} replace />
  }

  return (
    <SocketProvider>
      <SidebarProvider defaultOpen>
        <div className='relative w-full'>
          <ManagementNavbar />
          <div className='flex w-full'>
            <ManagementSidebar />
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </SocketProvider>
  )
}

export default Layout
