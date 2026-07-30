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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-lg, 4px)',
        padding: '8px 12px',
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto' }}>
          {[
            { id: 'telemetry', label: 'OVERVIEW & TELEMETRY', icon: Activity },
            { id: 'datasets', label: 'DATASETS', icon: Database },
            { id: 'jobs', label: 'TRAINING JOBS', icon: Play },
            { id: 'models', label: 'MODEL REGISTRY', icon: Brain },
            { id: 'inference', label: 'INFERENCE PLAYGROUND', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md, 3px)',
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  background: isActive ? 'var(--bg-raised)' : 'transparent',
                  border: isActive ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={13} style={{ color: isActive ? 'var(--purple)' : 'var(--text-tertiary)' }} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Right Status Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Tenant Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--bg-row)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-md, 3px)',
            padding: '4px 8px',
            fontFamily: 'var(--mono)',
            fontSize: 11,
          }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 600 }}>TENANT:</span>
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="default"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--purple)',
                color: 'var(--purple)',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                fontWeight: 600,
                width: 70,
                outline: 'none',
              }}
            />
          </div>

          {/* Health Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: isHealthy && isOllamaReachable ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
            border: `1px solid ${isHealthy && isOllamaReachable ? 'rgba(22,163,74,0.3)' : 'rgba(217,119,6,0.3)'}`,
            borderRadius: 'var(--radius-md, 3px)',
            padding: '4px 10px',
            fontFamily: 'var(--mono)',
            fontSize: 10,
            fontWeight: 600,
            color: isHealthy && isOllamaReachable ? 'var(--green)' : 'var(--amber)',
            letterSpacing: '0.03em',
          }}>
            {healthLoading ? (
              <RefreshCw size={11} className="animate-spin" />
            ) : isHealthy && isOllamaReachable ? (
              <CheckCircle2 size={12} />
            ) : (
              <AlertTriangle size={12} />
            )}
            <span>{isHealthy && isOllamaReachable ? 'PORT 8002 · ONLINE' : 'OLLAMA DEGRADED'}</span>
          </div>
        </div>
      </div>

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
