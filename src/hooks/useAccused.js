import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { addMockAccused, getMockAccused } from '../lib/devData'
import { isDevMode } from '../lib/env'

export const useAccused = (firId = '') => {
  return useQuery({
    queryKey: ['accused', firId],
    queryFn: async () => {
      if (isDevMode) {
        return getMockAccused(firId)
      }

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
      if (isDevMode) {
        return addMockAccused(accusedData)
      }

      const response = await apiClient.post('/api/accused/', accusedData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accused'] })
    },
  })
}
