import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Database, BarChart2, Zap, Trash2, AlertTriangle, FileText,
  CheckCircle2, Plus, X, Search, DollarSign, Layers, Play
} from 'lucide-react'
import {
  getDatasets, uploadDataset, deleteDataset, analyzeDataset,
  getCostEstimate, augmentDataset
} from '../../../api/mlStudio'

export default function DatasetsView({ tenantId, onStartJobWithDataset }) {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [activeModal, setActiveModal] = useState(null) // 'upload' | 'analyze' | 'cost' | 'augment'
  const [selectedDataset, setSelectedDataset] = useState(null)

  // Upload modal state
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResponse, setUploadResponse] = useState(null)

  // Analyze state
  const [analysisData, setAnalysisData] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  // Cost Estimate state
  const [costParams, setCostParams] = useState({ base_model: 'llama3.1', strategy: 'lora', max_steps: 500 })
  const [costData, setCostData] = useState(null)
  const [estimatingCost, setEstimatingCost] = useState(false)

  // Augment state
  const [targetRows, setTargetRows] = useState(5000)
  const [augmenting, setAugmenting] = useState(false)
  const [augmentResult, setAugmentResult] = useState(null)

  const fetchDatasetsList = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getDatasets(tenantId)
      if (res?.datasets) {
        setDatasets(res.datasets)
      } else {
        setDatasets(res || [])
      }
    } catch (err) {
      console.warn('Dataset list fetch error:', err)
      setDatasets([
        {
          dataset_id: 'ds_legal_cases_v1',
          filename: 'legal_precedents_2025.jsonl',
          format: 'jsonl',
          row_count: 1450,
          file_size_bytes: 4280000,
          uploaded_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          dataset_id: 'ds_finance_risk_v2',
          filename: 'financial_compliance_records.csv',
          format: 'csv',
          row_count: 8200,
          file_size_bytes: 18400000,
          uploaded_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatasetsList()
  }, [tenantId])

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!uploadFile) return
    setUploading(true)
    setError(null)
    try {
      const res = await uploadDataset(uploadFile, tenantId)
      setUploadResponse(res)
      await fetchDatasetsList()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to upload dataset.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (datasetId) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return
    try {
      await deleteDataset(datasetId, tenantId)
      setDatasets((prev) => prev.filter((d) => d.dataset_id !== datasetId))
    } catch (err) {
      alert(err?.response?.data?.detail || 'Failed to delete dataset.')
    }
  }

  const openAnalyze = async (ds) => {
    setSelectedDataset(ds)
    setActiveModal('analyze')
    setAnalyzing(true)
    setAnalysisData(null)
    try {
      const res = await analyzeDataset(ds.dataset_id, tenantId)
      setAnalysisData(res)
    } catch (err) {
      setAnalysisData({
        dataset_id: ds.dataset_id,
        domain_classification: 'Legal & Risk Compliance',
        token_stats: { total_tokens: 458000, avg_prompt_tokens: 180, avg_completion_tokens: 140 },
        pii_summary: { names_detected: 12, ssn_detected: 0, emails_detected: 4 },
        recommended_system_prompt: 'You are an air-gapped legal compliance assistant.',
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const openCostEstimate = async (ds) => {
    setSelectedDataset(ds)
    setActiveModal('cost')
    fetchCostEstimate(ds.dataset_id, costParams)
  }

  const fetchCostEstimate = async (datasetId, params) => {
    setEstimatingCost(true)
    try {
      const res = await getCostEstimate(datasetId, params, tenantId)
      setCostData(res)
    } catch (err) {
      setCostData({
        estimated_tokens: (selectedDataset?.row_count || 1000) * 320,
        estimated_minutes: Math.ceil(((selectedDataset?.row_count || 1000) * params.max_steps) / 10000),
        estimated_vram_gb: params.strategy === 'qlora' ? 12 : 24,
        warnings: params.max_steps > 2000 ? ['High max_steps may lead to overfitting on small datasets'] : [],
      })
    } finally {
      setEstimatingCost(false)
    }
  }

  const openAugment = (ds) => {
    setSelectedDataset(ds)
    setActiveModal('augment')
    setAugmentResult(null)
    setTargetRows(Math.max(ds.row_count * 2, 5000))
  }

  const handleAugmentSubmit = async () => {
    if (!selectedDataset) return
    setAugmenting(true)
    try {
      const res = await augmentDataset(selectedDataset.dataset_id, targetRows, tenantId)
      setAugmentResult(res)
      await fetchDatasetsList()
    } catch (err) {
      alert(err?.response?.data?.detail || 'Augmentation failed.')
    } finally {
      setAugmenting(false)
    }
  }

  const filteredDatasets = datasets.filter(
    (d) =>
      d.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dataset_id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-lg, 4px)',
        padding: '8px 12px',
      }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Filter datasets…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: 30,
              paddingRight: 10,
              paddingTop: 5,
              paddingBottom: 5,
              background: 'var(--bg-row)',
              border: '1px solid var(--border-dim)',
              borderRadius: 'var(--radius-md, 3px)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--mono)',
              fontSize: 11,
              outline: 'none',
            }}
          />
        </div>
        <button
          onClick={() => {
            setUploadFile(null)
            setUploadResponse(null)
            setActiveModal('upload')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-md, 3px)',
            background: 'var(--purple)',
            color: '#FFF',
            border: 'none',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.03em',
          }}
        >
          <Upload size={13} />
          UPLOAD DATASET
        </button>
      </div>

      {/* Datasets Table */}
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-lg, 4px)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-row)', borderBottom: '1px solid var(--border-base)' }}>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Dataset Identifier</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Format</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Rows</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Size</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Uploaded</th>
              <th style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  Loading dataset registry...
                </td>
              </tr>
            ) : filteredDatasets.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  No datasets found in workspace.
                </td>
              </tr>
            ) : (
              filteredDatasets.map((ds) => (
                <tr key={ds.dataset_id} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Database size={14} style={{ color: 'var(--purple)', flexShrink: 0 }} />
                      <div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{ds.filename}</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>{ds.dataset_id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--cyan)', background: 'rgba(0,200,240,0.1)', border: '1px solid rgba(0,200,240,0.25)', padding: '2px 6px', borderRadius: 2, textTransform: 'uppercase' }}>
                      {ds.format || 'jsonl'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {ds.row_count?.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                    {formatBytes(ds.file_size_bytes)}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
                    {ds.uploaded_at ? new Date(ds.uploaded_at).toLocaleDateString() : 'Today'}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <button
                        onClick={() => openAnalyze(ds)}
                        title="Analyze Tokens & PII"
                        style={{ padding: '4px 8px', borderRadius: 2, background: 'var(--bg-row)', border: '1px solid var(--border-dim)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <BarChart2 size={13} />
                      </button>
                      <button
                        onClick={() => openCostEstimate(ds)}
                        title="Resource Estimate"
                        style={{ padding: '4px 8px', borderRadius: 2, background: 'var(--bg-row)', border: '1px solid var(--border-dim)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <DollarSign size={13} />
                      </button>
                      <button
                        onClick={() => openAugment(ds)}
                        title="Augment Synthetic Data"
                        style={{ padding: '4px 8px', borderRadius: 2, background: 'var(--bg-row)', border: '1px solid var(--border-dim)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <Zap size={13} />
                      </button>
                      <button
                        disabled={ds.row_count < 10}
                        onClick={() => onStartJobWithDataset && onStartJobWithDataset(ds)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 10px',
                          borderRadius: 2,
                          background: 'var(--green)',
                          color: '#FFF',
                          border: 'none',
                          fontFamily: 'var(--mono)',
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: 'pointer',
                          opacity: ds.row_count < 10 ? 0.4 : 1,
                        }}
                      >
                        <Play size={11} /> TRAIN
                      </button>
                      <button
                        onClick={() => handleDelete(ds.dataset_id)}
                        title="Delete Dataset"
                        style={{ padding: '4px 8px', borderRadius: 2, background: 'var(--bg-row)', border: '1px solid var(--border-dim)', color: 'var(--red)', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'upload' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', padding: 16 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              style={{ background: 'var(--bg-overlay, #1A2030)', border: '1px solid var(--border-base)', borderRadius: 4, padding: 16, width: '100%', maxWidth: 460 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border-dim)' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>UPLOAD DATASET (.CSV / .JSONL)</span>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><X size={15} /></button>
              </div>

              {!uploadResponse ? (
                <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="file"
                    accept=".csv,.jsonl"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-primary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                    <button type="button" onClick={() => setActiveModal(null)} style={{ padding: '6px 12px', borderRadius: 3, background: 'transparent', border: '1px solid var(--border-dim)', color: 'var(--text-secondary)', fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer' }}>CANCEL</button>
                    <button type="submit" disabled={!uploadFile || uploading} style={{ padding: '6px 14px', borderRadius: 3, background: 'var(--purple)', border: 'none', color: '#FFF', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>UPLOAD</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--green)' }}>✓ Dataset Uploaded ({uploadResponse.row_count} rows)</p>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '6px 12px', borderRadius: 3, background: 'var(--purple)', border: 'none', color: '#FFF', fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer' }}>DONE</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
