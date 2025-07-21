import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { PagedList } from '~/types'
import type { Conversation, User } from '~/types/models'

export type ConversationWithPartner = Conversation & {
  partner: User
}

export const useConversations = (pageSize = 20) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ['conversations', accessToken],
    queryFn: async ({ pageParam = 1 }): Promise<PagedList<ConversationWithPartner>> => {
      const res = await http.get<PagedList<ConversationWithPartner>>('/api/chat/conversations', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        searchParams: {
          pageNumber: pageParam,
          pageSize
        }
      })
      if (res.success) return res.data
      return new PagedList([], 0, 1, 0)
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber < lastPage.totalPages) {
        return lastPage.pageNumber + 1
      }
      return undefined
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false
  })
}
