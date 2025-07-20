import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { PagedList } from '~/types'
import type { Lesson } from '~/types/models'

function useLessons(searchParams: { pageSize: string; pageIndex: number }) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['lessons', accessToken, searchParams],
    queryFn: async (): Promise<PagedList<Lesson>> => {
      if (!accessToken) return new PagedList<Lesson>([], 0, 0, 0)

      const res = await http.get<PagedList<Lesson>>(`/api/lessons`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        searchParams
      })

      if (res.success) return res.data
      return new PagedList<Lesson>([], 0, 0, 0)
    },
    placeholderData: keepPreviousData
  })
}

export default useLessons
