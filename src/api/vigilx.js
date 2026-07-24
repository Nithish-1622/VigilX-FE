import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[VigilX API Error]', err.message)
    return Promise.reject(err)
  }
)

// ─── AI Studio ───────────────────────────────────────────────
export const postV2Ask = (payload) =>
  api.post('/ai/v2/ask', payload).then((r) => r.data)

// ─── Data Studio ─────────────────────────────────────────────
export const getAdapterTest = () =>
  api.get('/adapter-test').then((r) => r.data)

// ─── Dashboard ───────────────────────────────────────────────
export const getGeography = () =>
  api.get('/ai/graph/geography').then((r) => r.data)

export const getVisualize = () =>
  api.get('/ai/graph/visualize').then((r) => r.data)

export default api
