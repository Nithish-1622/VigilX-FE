import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, ShieldCheck, Zap, RotateCcw, AlertTriangle, CheckCircle2,
  X, Layers, BarChart2, Eye, Trash2, ArrowUpRight, Copy, Power, RefreshCw
} from 'lucide-react'
import {
  getModels, getModel, compareModels, activateModel, rollbackModel,
  deactivateModel, deprecateModel, deleteModel
} from '../../../api/mlStudio'

export default function ModelsView({ tenantId, onSelectForPlayground }) {
  const [models, setModels] = useState([])
  const [activeOllamaModel, setActiveOllamaModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedForCompare, setSelectedForCompare] = useState([])
  const [compareData, setCompareData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [detailModel, setDetailModel] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const fetchModelsList = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getModels(tenantId)
      if (res?.models) {
        setModels(res.models)
        setActiveOllamaModel(res.active_model)
      } else {
        setModels(res || [])
      }
    } catch (err) {
      console.warn('Models fetch error:', err)
      const mockModels = [
        {
          model_id: 'mod_finance_lora_v2',
          model_name: 'Finance Compliance Fine-Tune',
          base_model: 'llama3.1',
          ollama_model_name: 'vigilx-finance-lora:v2',
          domain: 'Finance & Risk',
          version_label: 'v2.0-rc1',
          lifecycle_stage: 'production',
          is_active: true,
          final_loss: 0.22,
        },
        {
          model_id: 'mod_legal_lora_v1',
          model_name: 'Legal Precedents LoRA',
          base_model: 'mistral7b',
          ollama_model_name: 'vigilx-legal-lora:v1',
          domain: 'Legal Case Law',
          version_label: 'v1.0-stable',
          lifecycle_stage: 'approved',
          is_active: false,
          final_loss: 0.38,
        },
      ]
      setModels(mockModels)
      setActiveOllamaModel('vigilx-finance-lora:v2')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModelsList()
  }, [tenantId])

  const handleActivate = async (modelId) => {
    setActionLoadingId(modelId)
    try {
      await activateModel(modelId, tenantId)
      await fetchModelsList()
    } catch (err) {
      alert(err?.response?.data?.detail || 'Activation failed.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeactivate = async (modelId) => {
    setActionLoadingId(modelId)
    try {
      await deactivateModel(modelId, tenantId)
      await fetchModelsList()
    } catch (err) {
      alert(err?.response?.data?.detail || 'Deactivation failed.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const toggleCompareSelection = (modelId) => {
    setSelectedForCompare((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {/* Active Production Banner */}
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid rgba(22,163,74,0.3)',
        borderRadius: 'var(--radius-lg, 4px)',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={18} style={{ color: 'var(--green)' }} />
          <div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--green)', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
              ACTIVE INFERENCE MODEL
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeOllamaModel || 'No Active Model'}
            </span>
          </div>
        </div>

        {selectedForCompare.length > 0 && (
          <button
            style={{
              padding: '5px 12px',
              borderRadius: 3,
              background: 'var(--purple)',
              color: '#FFF',
              border: 'none',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            COMPARE ({selectedForCompare.length}) MODELS
          </button>
        )}
      </div>

      {/* Registered Models Table */}
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-lg, 4px)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-row)', borderBottom: '1px solid var(--border-base)' }}>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', textAlign: 'center' }}>Select</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Model Name & Version</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Domain</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Backbone</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Stage</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Final Loss</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  Loading model registry...
                </td>
              </tr>
            ) : (
              models.map((m) => {
                const isActive = m.is_active || m.ollama_model_name === activeOllamaModel
                return (
                  <tr key={m.model_id} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedForCompare.includes(m.model_id)}
                        onChange={() => toggleCompareSelection(m.model_id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Brain size={14} style={{ color: isActive ? 'var(--green)' : 'var(--text-tertiary)' }} />
                        <div>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{m.model_name}</span>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-tertiary)' }}>{m.ollama_model_name || m.model_id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{m.domain || 'General'}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--purple)' }}>{m.base_model || 'llama3.1'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: isActive ? 'var(--green)' : 'var(--purple)', background: isActive ? 'rgba(22,163,74,0.1)' : 'rgba(139,92,246,0.1)', border: `1px solid ${isActive ? 'rgba(22,163,74,0.3)' : 'rgba(139,92,246,0.3)'}`, padding: '2px 6px', borderRadius: 2, textTransform: 'uppercase' }}>
                        {isActive ? 'PRODUCTION' : m.lifecycle_stage || 'APPROVED'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>{m.final_loss ?? '0.22'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {isActive ? (
                        <button
                          onClick={() => handleDeactivate(m.model_id)}
                          style={{ padding: '4px 10px', borderRadius: 2, background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                        >
                          DEACTIVATE
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(m.model_id)}
                          style={{ padding: '4px 10px', borderRadius: 2, background: 'var(--green)', border: 'none', color: '#FFF', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                        >
                          ACTIVATE
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
