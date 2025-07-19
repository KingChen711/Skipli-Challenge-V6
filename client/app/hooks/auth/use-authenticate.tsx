import { useMutation } from '@tanstack/react-query'
import { http } from '~/lib/http'

import { z } from 'zod'
import type { TCheckExistAccountSchema } from './use-check-exist-account'
import type { ERole } from '~/types/models'

function useAuthenticate() {
  return useMutation({
    mutationFn: async (body: TAuthenticateSchema & TCheckExistAccountSchema) => {
      return await http.post<{ accessToken: string; phone: string; role: ERole }>(`/api/auth/authenticate`, body)
    }
  })
}

export default useAuthenticate

export const authenticateSchema = z.object({
  authType: z.enum(['password', 'sms', 'code']),
  authValue: z.string().trim().min(1)
})

export type TAuthenticateSchema = z.infer<typeof authenticateSchema>
