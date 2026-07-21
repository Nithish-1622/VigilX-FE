import { useMutation } from '@tanstack/react-query'
import { aiClient } from '../api/client'

export const useAskAI = () => {
  return useMutation({
    mutationFn: async ({ sessionId, question, userId = 'officer-1' }) => {
      const response = await aiClient.post('/ai/ask', {
        session_id: sessionId,
        user_id: userId,
        question,
      })
      return response.data
    },
  })
}
