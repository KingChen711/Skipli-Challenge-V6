import z from 'zod'
import { phoneNumberSchema } from '~/lib/schema'
import { useMutation } from '@tanstack/react-query'
import { http } from '~/lib/http'
import { useAuth } from '~/contexts/auth-provider'

export const addStudentSchema = z.object({
  phone: phoneNumberSchema,
  name: z.string().trim().min(3),
  email: z.email().trim().toLowerCase().min(1)
})

export type TAddStudentSchema = z.infer<typeof addStudentSchema>

function useAddStudent() {
  const { accessToken } = useAuth()
  return useMutation({
    mutationFn: async (body: TAddStudentSchema) => {
      return await http.post(`/api/users/add-student`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  })
}

export default useAddStudent
