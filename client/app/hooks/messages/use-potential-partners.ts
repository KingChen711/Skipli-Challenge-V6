import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import type { User } from '~/types/models'

export const usePotentialPartners = (enabled: boolean) => {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['potential-partners'],
    queryFn: async (): Promise<User[]> => {
      const res = await http.get<User[]>('/api/chat/potential-partners', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.success) return res.data
      return []
    },
    enabled
  })
}
