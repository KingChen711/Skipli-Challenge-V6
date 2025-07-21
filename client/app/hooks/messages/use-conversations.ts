import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import type { Conversation, User } from '~/types/models'

export type TConversation = Conversation & {
  partner: User
}

export const useConversations = () => {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['conversations', accessToken],
    queryFn: async (): Promise<TConversation[]> => {
      const res = await http.get<TConversation[]>('/api/chat/conversations', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.success) return res.data
      return []
    }
  })
}
