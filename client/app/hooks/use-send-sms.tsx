import { useMutation } from '@tanstack/react-query'
import { http } from '~/lib/http'

import type { TCheckExistAccountSchema } from './use-check-exist-account'

function useSendSMS() {
  return useMutation({
    mutationFn: async (body: TCheckExistAccountSchema) => {
      return await http.post<string>(`/api/auth/send-sms`, body)
    }
  })
}

export default useSendSMS
