import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { addMockVictim, getMockVictims } from '../lib/devData'
import { isDevMode } from '../lib/env'

export const useVictims = (firId = '') => {
  return useQuery({
    queryKey: ['victims', firId],
    queryFn: async () => {
      if (isDevMode) {
        return getMockVictims(firId)
      }

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
      if (isDevMode) {
        return addMockVictim(victimData)
      }

      const response = await apiClient.post('/api/victims/', victimData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['victims'] })
    },
  })
}
