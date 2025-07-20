import React, { createContext, useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { User } from '~/types/models'
import { useLocalStorage } from 'usehooks-ts'
import { http } from '~/lib/http'

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthContextType = {
  accessToken: string | null
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
  isLoadingAuth: boolean
  user: User | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('access-token', null)

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['whoami', accessToken],
    queryFn: async () => {
      return await http
        .get<User>('/api/auth/whoami', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then((res) => (res.success ? res.data : null))
        .catch(() => null)
    },
    enabled: !!accessToken
  })

  useEffect(() => {
    if (user?.phone) {
      window.localStorage.setItem('phone', user.phone)
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isLoadingAuth: isLoadingUser,
        user: user || null
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
