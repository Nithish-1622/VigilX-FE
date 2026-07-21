import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const useVictims = (firId = '') => {
  return useQuery({
    queryKey: ['victims', firId],
    queryFn: async () => {
      const response = await apiClient.get('/api/victims/', {
        params: firId ? { fir: firId } : {},
      })
      return response.data.results || response.data
    },
    staleTime: 1000 * 30,
  })
}

export const useCreateVictim = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (victimData) => {
      const response = await apiClient.post('/api/victims/', victimData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['victims'] })
    },
  })
}
