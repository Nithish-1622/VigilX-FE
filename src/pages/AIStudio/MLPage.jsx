import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Database, Play, Activity, Sparkles, AlertTriangle,
  RefreshCw, CheckCircle2, Shield
} from 'lucide-react'
import TelemetryView from './ml/TelemetryView'
import DatasetsView from './ml/DatasetsView'
import JobsView from './ml/JobsView'
import ModelsView from './ml/ModelsView'
import InferencePlayground from './ml/InferencePlayground'
import { getHealth } from '../../api/mlStudio'

export default function MLPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const subtabParam = searchParams.get('subtab')
  const [activeTab, setActiveTab] = useState(subtabParam || 'telemetry')
  const [tenantId, setTenantId] = useState('default')
  const [healthStatus, setHealthStatus] = useState(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [preselectedDataset, setPreselectedDataset] = useState(null)

  useEffect(() => {
    if (subtabParam && subtabParam !== activeTab) {
      setActiveTab(subtabParam)
    } else if (!subtabParam) {
      setActiveTab('telemetry')
    }
  }, [subtabParam])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setSearchParams({ tab: 'ml', subtab: newTab })
  }

  const checkGlobalHealth = async () => {
    setHealthLoading(true)
    try {
      const res = await getHealth(tenantId)
      setHealthStatus(res)
    } catch (err) {
      console.warn('Global health check warning:', err)
      setHealthStatus({ status: 'degraded', ollama: { ollama_reachable: false } })
    } finally {
      setHealthLoading(false)
    }
  }

  useEffect(() => {
    checkGlobalHealth()
    const interval = setInterval(checkGlobalHealth, 15000)
    return () => clearInterval(interval)
  }, [tenantId])

  const handleStartJobWithDataset = (dataset) => {
    setPreselectedDataset(dataset)
    handleTabChange('jobs')
  }

  const isHealthy = healthStatus?.status === 'ok' || healthStatus?.status === 'success'
  const isOllamaReachable = healthStatus?.ollama?.ollama_reachable !== false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', color: 'var(--text-primary)' }}>
      {/* Sleek Command-Center Control & Navigation Bar */}
      

      {/* Sub-Tab View Container */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.12 }}
        style={{ width: '100%' }}
      >
        {activeTab === 'telemetry' && <TelemetryView tenantId={tenantId} />}
        {activeTab === 'datasets' && (
          <DatasetsView tenantId={tenantId} onStartJobWithDataset={handleStartJobWithDataset} />
        )}
        {activeTab === 'jobs' && (
          <JobsView tenantId={tenantId} preselectedDataset={preselectedDataset} />
        )}
        {activeTab === 'models' && (
          <ModelsView tenantId={tenantId} onSelectForPlayground={() => setActiveTab('inference')} />
        )}
        {activeTab === 'inference' && (
          <InferencePlayground tenantId={tenantId} onNavigateToModels={() => setActiveTab('models')} />
        )}
      </motion.div>
    </div>
  )
}
