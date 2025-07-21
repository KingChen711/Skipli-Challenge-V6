import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import type { Message } from '~/types/models'

export const useMessages = (partnerId: string | null) => {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['messages', partnerId, accessToken],
    queryFn: async (): Promise<Message[]> => {
      if (!partnerId) return []
      const res = await http.get<Message[]>(`/api/chat/messages/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.success) return res.data
      return []
    },
    enabled: !!partnerId,
    refetchOnWindowFocus: false
  })
}
