import { useMutation } from '@tanstack/react-query'
import z from 'zod'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'
import { phoneNumberSchema, usernameSchema } from '~/lib/schema'

export const editProfileSchema = z.object({
  name: z.string().trim().min(3),
  phone: phoneNumberSchema,
  email: z.string().trim().email().toLowerCase().min(1),
  username: usernameSchema
})

export type TEditProfileSchema = z.infer<typeof editProfileSchema>

function useEditProfile() {
  const { accessToken } = useAuth()
  return useMutation({
    mutationFn: async (body: TEditProfileSchema) => {
      return await http.put(`/api/users/edit-profile`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  })
}

export default useEditProfile
