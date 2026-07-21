import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const useCases = (searchQuery = '') => {
  return useQuery({
    queryKey: ['cases', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get('/api/cases/', {
        params: searchQuery ? { search: searchQuery } : {},
      })
      return response.data.results || response.data
    },
    staleTime: 1000 * 30,
  })
}

export const useCreateCase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newCaseData) => {
      const response = await apiClient.post('/api/cases/', newCaseData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })
}
