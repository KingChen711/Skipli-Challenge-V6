import { useMutation } from '@tanstack/react-query'
import { http } from '~/lib/http'
import { useAuth } from '~/contexts/auth-provider'

function useMarkLessonDone() {
  const { accessToken } = useAuth()
  return useMutation({
    mutationFn: async (lessonId: string) => {
      return await http.post(
        `/api/lessons/mark-lesson-done`,
        {
          lessonId
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
    }
  })
}

export default useMarkLessonDone
