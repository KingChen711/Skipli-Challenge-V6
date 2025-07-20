import { useMutation } from '@tanstack/react-query'
import z from 'zod'
import { http } from '~/lib/http'
import { usernameSchema } from '~/lib/schema'

export const completeSetupSchema = z
  .object({
    token: z.string().trim().min(1),
    username: usernameSchema,
    password: z.string().trim().min(6),
    confirmPassword: z.string().trim().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  })

export type TCompleteSetupAccountSchema = z.infer<typeof completeSetupSchema>

function useCompleteSetupAccount() {
  return useMutation({
    mutationFn: async (body: TCompleteSetupAccountSchema) => {
      return await http.post(`/api/auth/setup/complete`, body)
    }
  })
}

export default useCompleteSetupAccount
