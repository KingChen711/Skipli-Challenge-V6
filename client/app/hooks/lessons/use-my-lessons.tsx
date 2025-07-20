import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { PagedList } from '~/types'
import type { EStudentLessonStatus, Lesson } from '~/types/models'

type MyLessons = Lesson & { status: EStudentLessonStatus }

function useMyLessons(searchParams: { pageSize: string; pageIndex: number }) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['my-lessons', accessToken, searchParams],
    queryFn: async (): Promise<PagedList<MyLessons>> => {
      if (!accessToken) return new PagedList<MyLessons>([], 0, 0, 0)

      const res = await http.get<PagedList<MyLessons>>(`/api/lessons/my-lessons`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        searchParams
      })

      if (res.success) return res.data
      return new PagedList<MyLessons>([], 0, 0, 0)
    },
    placeholderData: keepPreviousData
  })
}

export default useMyLessons
