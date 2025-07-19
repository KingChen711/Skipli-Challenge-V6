import { useMutation } from '@tanstack/react-query'
import { http } from '~/lib/http'

import { z } from 'zod'
import { phoneNumberSchema } from '~/lib/schema'

function useCheckExistAccount() {
  return useMutation({
    mutationFn: async (body: TCheckExistAccountSchema) => {
      return await http.post<boolean>(`/api/auth/check-exist-account`, body)
    }
  })
}

export default useCheckExistAccount

export const checkExistAccountSchema = z
  .object({
    type: z.enum(['email', 'phone', 'username']),
    identifier: z.string().trim().min(3)
  })
  .refine(
    (data) => {
      if (data.type !== 'email') return true
      return z.email().trim().toLowerCase().safeParse(data.identifier).success
    },
    {
      path: ['identifier'],
      message: 'Invalid email'
    }
  )
  .refine(
    (data) => {
      if (data.type !== 'phone') return true
      return phoneNumberSchema.safeParse(data.identifier).success
    },
    {
      path: ['identifier'],
      message: 'Invalid phone'
    }
  )
  .transform((data) => {
    if (data.type !== 'username') return data
    return { ...data, identifier: data.identifier.toLowerCase() }
  })

export type TCheckExistAccountSchema = z.infer<typeof checkExistAccountSchema>
