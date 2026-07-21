import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppRoutes } from './routes'

// Initialize TanStack Query Client with custom options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Platform Routing Shell */}
      <AppRoutes />

      {/* Security Alerts and Status Messages */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111622',
            color: '#f8fafc',
            border: '1px solid #1c2333',
            fontSize: '12px',
            fontFamily: 'Outfit, sans-serif',
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
