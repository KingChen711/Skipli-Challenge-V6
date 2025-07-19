import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import ManagementNavbar from './_components/main-navbar'
import { SidebarProvider } from '~/components/ui/sidebar'
import { useAuth } from '~/contexts/auth-provider'
import { BookOpen } from 'lucide-react'
import { ManagementSidebar } from './_components/main-sidebar'

function Layout() {
  const { user, isLoadingAuth } = useAuth()
  const location = useLocation()
  const [showLoading, setShowLoading] = useState(true)

  //wait at least 700ms if the user is loading sooner
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [])

  if (isLoadingAuth || showLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <BookOpen className='w-8 h-8 text-primary-foreground' />
          </div>
          <h1 className='text-2xl font-bold mb-2'>Welcome to LearnHub</h1>
          <p className='text-muted-foreground mb-2'>Unlock Your Potential</p>
          <div className='relative w-16 h-16 mx-auto mb-6'>
            <div className='absolute inset-0 border-4 border-primary/20 rounded-full'></div>
            <div
              className='absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin'
              style={{ animationDuration: '1s' }}
            ></div>
            <div className='absolute inset-2 bg-primary/20 rounded-full flex items-center justify-center'>
              <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />
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
