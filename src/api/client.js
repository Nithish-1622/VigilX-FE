import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import { isDevMode } from '../lib/env'

export const DJANGO_BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || 'http://127.0.0.1:8000'
export const FASTAPI_BASE_URL = import.meta.env.VITE_FASTAPI_BASE_URL || 'http://127.0.0.1:8001'

export const apiClient = axios.create({
  baseURL: DJANGO_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const aiClient = axios.create({
  baseURL: FASTAPI_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const addAuthToken = (config) => {
  if (isDevMode) {
    return config
  }

  const token = useAuthStore.getState().accessToken
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

apiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))
aiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (cb) => { refreshSubscribers.push(cb) }
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

const handleTokenRefresh = async (error, clientInstance) => {
  if (isDevMode) {
    return Promise.reject(error)
  }

  const { config, response } = error
  const originalRequest = config

  if (response && response.status === 401 && !originalRequest._retry) {
    if (originalRequest.url?.includes('/api/auth/login/') || originalRequest.url?.includes('/api/auth/refresh/')) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
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
      return Promise.reject(error)
    }

    try {
      const res = await axios.post(`${DJANGO_BASE_URL}/api/auth/refresh/`, { refresh: refreshToken })
      const newAccessToken = res.data.access
      const newRefreshToken = res.data.refresh || refreshToken

      useAuthStore.getState().setTokens({ access: newAccessToken, refresh: newRefreshToken })
      onRefreshed(newAccessToken)
      isRefreshing = false

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return clientInstance(originalRequest)
    } catch (refreshError) {
      isRefreshing = false
      refreshSubscribers = []
      useAuthStore.getState().logout()
      return Promise.reject(refreshError)
    }
  }

  return Promise.reject(error)
}

apiClient.interceptors.response.use((r) => r, (e) => handleTokenRefresh(e, apiClient))
aiClient.interceptors.response.use((r) => r, (e) => handleTokenRefresh(e, aiClient))
