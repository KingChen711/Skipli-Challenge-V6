import { useQuery } from '@tanstack/react-query'
import { http } from '~/lib/http'
import type { User } from '~/types/models'

function useVerifySetupToken(token: string | null) {
  return useQuery({
    queryKey: ['verify-setup-token', token],
    queryFn: async () => {
      const res = await http.get<User>(`/api/auth/setup/verify/${token}`)
      if (res.success) {
        return res?.data || null
      }
      return null
    },
    enabled: !!token
  })
}

export default useVerifySetupToken
