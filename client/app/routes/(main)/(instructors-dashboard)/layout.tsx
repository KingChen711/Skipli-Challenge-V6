import { Navigate, Outlet } from 'react-router'

import { useAuth } from '~/contexts/auth-provider'
import { ERole } from '~/types/models'

function Layout() {
  const { user } = useAuth()

  //main layout will wait for loading auth, not need to check here

  if (user && user.role !== ERole.INSTRUCTOR) {
    return <Navigate to={`/login`} replace />
  }

  return <Outlet />
}

export default Layout
