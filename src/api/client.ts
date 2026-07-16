import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

export const DJANGO_BASE_URL = 'http://127.0.0.1:8000'
export const FASTAPI_BASE_URL = 'http://127.0.0.1:8001'

export const apiClient = axios.create({
  baseURL: DJANGO_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const aiClient = axios.create({
  baseURL: FASTAPI_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to append authorization token
const addAuthToken = (config: any) => {
  const token = useAuthStore.getState().accessToken
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

apiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))
aiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))

// Variables for refresh queue
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

// Response interceptor for token refresh
const handleTokenRefresh = async (error: any, clientInstance: any) => {
  const { config, response } = error
  const originalRequest = config

  // If unauthorized error and not already retried
  if (response && response.status === 401 && !originalRequest._retry) {
    // Avoid infinite loop if auth requests fail
    if (
      originalRequest.url?.includes('/api/auth/login/') || 
      originalRequest.url?.includes('/api/auth/refresh/')
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(clientInstance(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = useAuthStore.getState().refreshToken

    if (!refreshToken) {
      useAuthStore.getState().logout()
      redirectToLogin()
      return Promise.reject(error)
    }

    try {
      // Direct call to refresh endpoint using core axios to prevent interceptor loop
      const res = await axios.post(`${DJANGO_BASE_URL}/api/auth/refresh/`, {
        refresh: refreshToken,
      })

      const newAccessToken = res.data.access
      const newRefreshToken = res.data.refresh || refreshToken

      // Update store
      useAuthStore.getState().setTokens({ access: newAccessToken, refresh: newRefreshToken })

      onRefreshed(newAccessToken)
      isRefreshing = false

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return clientInstance(originalRequest)
    } catch (refreshError) {
      isRefreshing = false
      refreshSubscribers = []
      useAuthStore.getState().logout()
      redirectToLogin()
      return Promise.reject(refreshError)
    }
  }

  return Promise.reject(error)
}

const redirectToLogin = () => {
  if (window.location.hash) {
    window.location.hash = '/login'
  } else {
    window.location.pathname = '/login'
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => handleTokenRefresh(error, apiClient)
)

aiClient.interceptors.response.use(
  (response) => response,
  (error) => handleTokenRefresh(error, aiClient)
)
