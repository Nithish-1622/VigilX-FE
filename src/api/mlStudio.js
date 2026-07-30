import axios from 'axios'

const ML_STUDIO_BASE_URL = import.meta.env.VITE_ML_STUDIO_URL || 'http://localhost:8002'

export const mlStudioApi = axios.create({
  baseURL: ML_STUDIO_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'default',
    'X-User-ID': '1',
    'X-Username': 'dev',
    'X-Permissions': 'ml_studio.activate_model,ml_studio.approve_job,ml_studio.reject_job,ml_studio.rollback_model,ml_studio.deprecate_model',
  },
})

// Helper to build headers dynamically with specific tenant ID if provided
const getHeaders = (tenantId) => {
  const headers = {}
  if (tenantId) {
    headers['X-Tenant-ID'] = tenantId
  }
  return { headers }
}

// ── Health & Telemetry ────────────────────────────────────────────────────────
export const getBanner = async (tenantId) => {
  const res = await mlStudioApi.get('/', getHeaders(tenantId))
  return res.data
}

export const getHealth = async (tenantId) => {
  const res = await mlStudioApi.get('/health', getHeaders(tenantId))
  return res.data
}

export const getTelemetryStatus = async (tenantId) => {
  const res = await mlStudioApi.get('/ml/telemetry/status', getHeaders(tenantId))
  return res.data
}

export const getTelemetryHardware = async (tenantId) => {
  const res = await mlStudioApi.get('/ml/telemetry/hardware', getHeaders(tenantId))
  return res.data
}

export const getJobLiveTelemetry = async (jobId, tenantId) => {
  const res = await mlStudioApi.get(`/ml/telemetry/job/${jobId}/live`, getHeaders(tenantId))
  return res.data
}

// ── Datasets ──────────────────────────────────────────────────────────────────
export const uploadDataset = async (file, tenantId) => {
  const formData = new FormData()
  formData.append('file', file)
  const config = getHeaders(tenantId)
  config.headers['Content-Type'] = 'multipart/form-data'
  const res = await mlStudioApi.post('/ml/datasets/upload', formData, config)
  return res.data
}

export const getDatasets = async (tenantId) => {
  const res = await mlStudioApi.get('/ml/datasets/list', getHeaders(tenantId))
  return res.data
}

export const getDataset = async (datasetId, tenantId) => {
  const res = await mlStudioApi.get(`/ml/datasets/${datasetId}`, getHeaders(tenantId))
  return res.data
}

export const deleteDataset = async (datasetId, tenantId) => {
  const res = await mlStudioApi.delete(`/ml/datasets/${datasetId}`, getHeaders(tenantId))
  return res.data
}

export const analyzeDataset = async (datasetId, tenantId) => {
  const res = await mlStudioApi.get(`/ml/datasets/${datasetId}/analyze`, getHeaders(tenantId))
  return res.data
}

export const getCostEstimate = async (datasetId, params = {}, tenantId) => {
  const config = getHeaders(tenantId)
  config.params = {
    base_model: params.base_model || 'llama3.1',
    strategy: params.strategy || 'lora',
    max_steps: params.max_steps || 500,
  }
  const res = await mlStudioApi.get(`/ml/datasets/${datasetId}/cost-estimate`, config)
  return res.data
}

export const augmentDataset = async (datasetId, targetRows = 5000, tenantId) => {
  const res = await mlStudioApi.post(
    `/ml/datasets/${datasetId}/augment?target_rows=${targetRows}`,
    {},
    getHeaders(tenantId)
  )
  return res.data
}

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const startJob = async (config, tenantId) => {
  const res = await mlStudioApi.post('/ml/jobs/start', { config }, getHeaders(tenantId))
  return res.data
}

export const getJobs = async (tenantId) => {
  const res = await mlStudioApi.get('/ml/jobs/list', getHeaders(tenantId))
  return res.data
}

export const getJobStatus = async (jobId, tenantId) => {
  const res = await mlStudioApi.get(`/ml/jobs/${jobId}/status`, getHeaders(tenantId))
  return res.data
}

export const getJobReport = async (jobId, tenantId) => {
  const res = await mlStudioApi.get(`/ml/jobs/${jobId}/report`, getHeaders(tenantId))
  return res.data
}

export const getJobReportHtmlUrl = (jobId) => {
  return `${ML_STUDIO_BASE_URL}/ml/jobs/${jobId}/report.html`
}

export const downloadJobReportPdf = async (jobId, tenantId) => {
  const config = getHeaders(tenantId)
  config.responseType = 'blob'
  const res = await mlStudioApi.get(`/ml/jobs/${jobId}/report.pdf`, config)
  return res.data
}

export const approveJob = async (jobId, payload = {}, tenantId) => {
  const body = {
    approved_by: payload.approved_by || 'admin_user',
    comment: payload.comment || 'Approved via ML Studio',
  }
  const res = await mlStudioApi.post(`/ml/jobs/${jobId}/approve`, body, getHeaders(tenantId))
  return res.data
}

export const rejectJob = async (jobId, payload = {}, tenantId) => {
  const body = {
    rejected_by: payload.rejected_by || 'admin_user',
    reason: payload.reason || 'Quality gate rejected',
  }
  const res = await mlStudioApi.post(`/ml/jobs/${jobId}/reject`, body, getHeaders(tenantId))
  return res.data
}

export const cancelJob = async (jobId, tenantId) => {
  const res = await mlStudioApi.delete(`/ml/jobs/${jobId}`, getHeaders(tenantId))
  return res.data
}

// ── Models ────────────────────────────────────────────────────────────────────
export const getModels = async (tenantId) => {
  const res = await mlStudioApi.get('/ml/models/list', getHeaders(tenantId))
  return res.data
}

export const getModel = async (modelId, tenantId) => {
  const res = await mlStudioApi.get(`/ml/models/${modelId}`, getHeaders(tenantId))
  return res.data
}

export const compareModels = async (idsArray = [], tenantId) => {
  const idsStr = Array.isArray(idsArray) ? idsArray.join(',') : idsArray
  const res = await mlStudioApi.get(`/ml/models/compare?ids=${encodeURIComponent(idsStr)}`, getHeaders(tenantId))
  return res.data
}

export const activateModel = async (modelId, tenantId) => {
  const res = await mlStudioApi.post(`/ml/models/${modelId}/activate`, {}, getHeaders(tenantId))
  return res.data
}

export const rollbackModel = async (modelId, tenantId) => {
  const res = await mlStudioApi.post(`/ml/models/${modelId}/rollback`, {}, getHeaders(tenantId))
  return res.data
}

export const deactivateModel = async (modelId, tenantId) => {
  const res = await mlStudioApi.post(`/ml/models/${modelId}/deactivate`, {}, getHeaders(tenantId))
  return res.data
}

export const deprecateModel = async (modelId, tenantId) => {
  const res = await mlStudioApi.post(`/ml/models/${modelId}/deprecate`, {}, getHeaders(tenantId))
  return res.data
}

export const deleteModel = async (modelId, tenantId) => {
  const res = await mlStudioApi.delete(`/ml/models/${modelId}`, getHeaders(tenantId))
  return res.data
}

// ── Inference ─────────────────────────────────────────────────────────────────
export const queryInference = async (payload, tenantId) => {
  const body = {
    question: payload.question,
    user_id: payload.user_id || 'ml_studio_user',
    session_id: payload.session_id || 'ml_studio_session',
    model_override: payload.model_override || null,
    stream: false,
  }
  const res = await mlStudioApi.post('/ml/inference/query', body, getHeaders(tenantId))
  return res.data
}

export const compareInference = async (payload, tenantId) => {
  const body = {
    candidate_model_id: payload.candidate_model_id,
    prompt: payload.prompt,
    user_id: payload.user_id || 'ml_studio_user',
    session_id: payload.session_id || 'ml_studio_session',
  }
  const res = await mlStudioApi.post('/ml/inference/compare', body, getHeaders(tenantId))
  return res.data
}

export const getInferenceHealth = async (tenantId) => {
  const res = await mlStudioApi.get('/ml/inference/health', getHeaders(tenantId))
  return res.data
}

export default mlStudioApi
