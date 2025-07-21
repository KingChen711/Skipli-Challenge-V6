import { useAuth } from '~/contexts/auth-provider'
import type { Route } from './+types/home'
import { ERole } from '~/types/models'
import { Navigate } from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'LearnHub' }, { name: 'description', content: 'Welcome to LearnHub!' }]
}

export default function Home() {
  const { user } = useAuth()

  //main layout will wait for loading auth, not need to check here

  if (user && user.role === ERole.STUDENT) {
    return <Navigate to={`/my-lessons`} replace />
  }

  return <Navigate to={`/lessons`} replace />
}
