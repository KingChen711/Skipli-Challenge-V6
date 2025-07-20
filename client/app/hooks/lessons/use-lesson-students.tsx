import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { PagedList } from '~/types'
import type { EStudentLessonStatus, User } from '~/types/models'

type StudentLesson = User & { status: EStudentLessonStatus }

function useLessonStudents(id: string, searchParams: { pageSize: string; pageIndex: number }, enabled: boolean) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['lesson-students', id, accessToken, searchParams],
    queryFn: async (): Promise<PagedList<StudentLesson>> => {
      if (!accessToken) return new PagedList<StudentLesson>([], 0, 0, 0)

      const res = await http.get<PagedList<StudentLesson>>(`/api/lessons/${id}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        searchParams
      })

      if (res.success) return res.data
      return new PagedList<StudentLesson>([], 0, 0, 0)
    },
    placeholderData: keepPreviousData,
    enabled
  })
}

export default useLessonStudents
