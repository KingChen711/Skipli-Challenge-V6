import { useMutation } from '@tanstack/react-query'
import z from 'zod'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { phoneNumberSchema, usernameSchema } from '~/lib/schema'

export const editStudentSchema = z.object({
  phone: phoneNumberSchema,
  name: z.string().trim().min(3),
  email: z.string().trim().email().toLowerCase().min(1),
  username: usernameSchema
})

export type TEditStudentSchema = z.infer<typeof editStudentSchema>

function useEditStudent() {
  const { accessToken } = useAuth()
  return useMutation({
    mutationFn: async (body: TEditStudentSchema & { oldPhone: string }) => {
      return await http.put(`/api/users/edit-student/${body.oldPhone}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  })
}

export default useEditStudent
