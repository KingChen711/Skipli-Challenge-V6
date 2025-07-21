import { useMutation } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth-provider'
import { http } from '~/lib/http'

type SendMessageBody = {
  receiverId: string
  content: string
}

export const useSendMessage = () => {
  const { accessToken } = useAuth()
  return useMutation({
    mutationFn: async (body: SendMessageBody) => {
      return await http.post('/api/chat/send-message', body, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  })
}
