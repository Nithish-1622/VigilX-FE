import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import DataStudio from './pages/DataStudio'
import AIStudio from './pages/AIStudio'
import ExperimentalStudio from './pages/ExperimentalStudio'
import Settings from './pages/Settings'
import HelpCenter from './pages/HelpCenter'

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="data-studio/*" element={<DataStudio />} />
            <Route path="ai-studio/*" element={<AIStudio />} />
            <Route path="experimental/*" element={<ExperimentalStudio />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<HelpCenter />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
