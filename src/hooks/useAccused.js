import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const useAccused = (firId = '') => {
  return useQuery({
    queryKey: ['accused', firId],
    queryFn: async () => {
      const response = await apiClient.get('/api/accused/', {
        params: firId ? { fir: firId } : {},
      })
      return response.data.results || response.data
    },
    staleTime: 1000 * 30,
  })
}

export const useCreateAccused = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (accusedData) => {
      const response = await apiClient.post('/api/accused/', accusedData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accused'] })
    },
  })
}
