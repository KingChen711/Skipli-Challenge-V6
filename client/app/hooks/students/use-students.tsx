import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { PagedList } from '~/types'
import type { User } from '~/types/models'

function useStudents(searchParams: { pageSize: string; pageIndex: number }) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['students', accessToken, searchParams],
    queryFn: async (): Promise<PagedList<User>> => {
      if (!accessToken) return new PagedList<User>([], 0, 0, 0)

      const res = await http.get<PagedList<User>>(`/api/users/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        searchParams
      })

      if (res.success) return res.data
      return new PagedList<User>([], 0, 0, 0)
    },
    placeholderData: keepPreviousData
  })
}

export default useStudents
