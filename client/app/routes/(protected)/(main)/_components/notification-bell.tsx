import { Bell } from 'lucide-react'

import { Button } from '~/components/ui/button'

export function NotificationBell() {
  return (
    <Button variant='ghost' className='relative' size='icon'>
      <Bell className='size-5' />
    </Button>
  )
}

export default NotificationBell
