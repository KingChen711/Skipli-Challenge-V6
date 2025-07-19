import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import ManagementNavbar from './_components/main-navbar'
import { SidebarProvider } from '~/components/ui/sidebar'
import { useAuth } from '~/contexts/auth-provider'

import { ManagementSidebar } from './_components/main-sidebar'
import SplashScreen from '~/components/ui/splash-screen'

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
    <SidebarProvider defaultOpen>
      <div className='relative w-full'>
        <ManagementNavbar />
        <div className='flex w-full'>
          <ManagementSidebar />
          <section className='flex min-h-screen flex-1 flex-col p-6 pt-[88px]'>
            <div className='mx-auto w-full max-w-[1620px]'>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
