import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { PagedList } from '~/types'
import type { Message } from '~/types/models'

export const useMessages = (partnerId: string | null, pageSize = 15) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ['messages', partnerId, accessToken],
    queryFn: async ({ pageParam = 1 }): Promise<PagedList<Message>> => {
      if (!partnerId) return new PagedList([], 0, 1, 0)

      const res = await http.get<PagedList<Message>>(`/api/chat/messages/${partnerId}`, {
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
    enabled: !!partnerId,
    refetchOnWindowFocus: false
  })
}
