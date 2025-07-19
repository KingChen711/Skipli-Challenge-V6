import { useMutation } from '@tanstack/react-query'

import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'

function useDeleteStudent() {
  const { accessToken } = useAuth()
  return useMutation({
    mutationFn: async (phone: string) => {
      return await http.delete(`/api/users/student/${phone}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  })
}

export default useDeleteStudent
