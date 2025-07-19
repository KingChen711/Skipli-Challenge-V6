import { cn } from '~/lib/utils'
// import { useSidebar } from '~/components/ui/sidebar'

import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import NotificationBell from './notification-bell'
import { Calendar, Clock } from 'lucide-react'
import { useSidebar } from '~/components/ui/sidebar'
function ManagementNavbar() {
  const { open } = useSidebar()

  const [currentDate, setCurrentDate] = useState<string>(format(new Date(Date.now()), 'HH:mm'))

  useEffect(() => {
    // Update currentDate only on the client
    const interval = setInterval(() => {
      setCurrentDate(format(new Date(Date.now()), 'HH:mm'))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 z-10 flex h-16 w-full items-center justify-end gap-4 bg-card px-6 shadow transition-all',
        open ? 'lg:pl-[279px]' : 'lg:pl-[71px]'
      )}
    >
      <div className='flex items-center gap-x-2'>
        <section className='flex items-center gap-4 text-nowrap rounded-md text-muted-foreground max-lg:hidden'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Clock size={16} />
            <span className='leading-none'>{currentDate || '--:--'}</span>
          </div>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Calendar size={16} />
            <span className='leading-none'>{format(new Date(Date.now()), 'dd MMM yyyy')}</span>
          </div>
        </section>
        <NotificationBell />
      </div>
    </nav>
  )
}

export default ManagementNavbar
