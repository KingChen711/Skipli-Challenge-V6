import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import type { Conversation, User } from '~/types/models'

export type ConversationWithPartner = Conversation & {
  partner: User
}

export const useConversations = () => {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['conversations', accessToken],
    queryFn: async (): Promise<ConversationWithPartner[]> => {
      const res = await http.get<ConversationWithPartner[]>('/api/chat/conversations', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.success) return res.data
      return []
    },
    refetchOnWindowFocus: false
  })
}
