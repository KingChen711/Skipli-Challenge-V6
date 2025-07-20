import z from 'zod'
import { phoneNumberSchema } from '~/lib/schema'
import { useMutation } from '@tanstack/react-query'
import { http } from '~/lib/http'
import { useAuth } from '~/contexts/auth-provider'

export const assignLessonSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(3),
  studentPhones: z
    .array(
      z.object({
        phone: phoneNumberSchema
      })
    )
    .min(1, 'At least one phone number is required')
})

export type TAssignLessonSchema = z.infer<typeof assignLessonSchema>

function useAssignLesson() {
  const { accessToken } = useAuth()
  return useMutation({
    mutationFn: async (body: TAssignLessonSchema) => {
      return await http.post(
        `/api/lessons/assign-lesson`,
        {
          ...body,
          studentPhones: body.studentPhones.map((phone) => phone.phone)
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

export default useAssignLesson
