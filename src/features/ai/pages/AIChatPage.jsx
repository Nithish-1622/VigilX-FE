import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAskAI } from '../../../hooks/useAskAI'
import { useSessionStore } from '../../../store/useSessionStore'
import { WelcomeConsole } from '../components/WelcomeConsole'
import { WorkspaceHeader } from '../components/WorkspaceHeader'
import { InvestigationHistorySidebar } from '../components/InvestigationHistorySidebar'
import { InvestigationReportCard } from '../components/InvestigationReportCard'
import { Send, Loader2 } from 'lucide-react'

const toDisplayText = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(toDisplayText).filter(Boolean).join(', ')
  if (typeof value === 'object') return value.name ?? value.label ?? value.title ?? JSON.stringify(value)
  return String(value)
}

const normalizeKeyDetails = (details) => {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return {}
  }

  return Object.entries(details).reduce((acc, [key, value]) => {
    const normalized = toDisplayText(value)
    if (normalized !== '') {
      acc[key] = normalized
    }
    return acc
  }, {})
}

const normalizeFollowUps = (followUps) => {
  if (!Array.isArray(followUps)) return []
  return followUps.map(toDisplayText).filter(Boolean)
}

const normalizeTimeline = (timeline) => {
  if (!Array.isArray(timeline)) return []

  return timeline
    .map((event) => {
      if (!event || typeof event !== 'object') return null
      return {
        event: toDisplayText(event.event ?? event.title ?? event.label ?? ''),
        time: toDisplayText(event.time ?? event.date_time ?? event.timestamp ?? ''),
        description: toDisplayText(event.description ?? event.details ?? ''),
      }
    })
    .filter((event) => event && event.event)
}

const buildReport = (question, response) => {
  const payload = response.data ?? response
  const data = payload.data ?? payload
  const metadata = payload.metadata ?? data.metadata ?? {}
  const answer = data.answer ?? data.summary ?? payload.message ?? 'No answer returned from AI engine.'

  return {
    id: payload.id ?? data.id ?? `REP-${Date.now()}`,
    timestamp: new Date().toISOString().split('T')[0],
    query: question,
    summary: answer,
    keyDetails: normalizeKeyDetails(data.key_details ?? data.keyDetails ?? {
      intent: data.intent ?? metadata.intent ?? 'unknown',
      evidence_used: data.evidence_used ?? metadata.evidence_sources ?? 0,
      case_summary: data.case_summary ?? null,
    }),
    evidence: {
      confidence: metadata.confidence ?? data.confidence ?? 'medium',
      sourcesCount: metadata.evidence_sources ?? data.evidence_used ?? 0,
      citations: payload.citations ?? data.citations ?? [],
      ragCitations: metadata.rag_citations ?? 0,
      sqlCitations: metadata.sql_citations ?? 0,
      langGraphActive: metadata.langgraph_enabled ?? false,
    },
    graphData: data.graphData ?? data.graph_data ?? null,
    timeline: normalizeTimeline(data.timeline ?? data.timeline_events ?? []),
    followUps: normalizeFollowUps(data.followUps ?? data.follow_ups ?? payload.follow_ups ?? []),
  }
}

export const AIChatPage = () => {
  const { activeChatSessionId, setActiveChatSessionId } = useSessionStore()

  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(activeChatSessionId || null)
  const [sessionSearch, setSessionSearch] = useState('')
  const [reports, setReports] = useState([])
  const [input, setInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const askAIMutation = useAskAI()
  const messagesEndRef = useRef(null)

  const isWelcomeState = reports.length === 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [reports])

  // ── Session management ──
  const createSession = (firstQuestion) => {
    const newId = `inv-session-${Date.now()}`
    const newSession = {
      id: newId,
      title: firstQuestion.length > 38 ? firstQuestion.slice(0, 38) + '…' : firstQuestion,
      time: 'Just now',
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newId)
    setActiveChatSessionId(newId)
    return newId
  }

  const handleCreateSession = () => {
    setReports([])
    setInput('')
    const newId = `inv-session-${Date.now()}`
    setSessions((prev) => [{ id: newId, title: 'New Investigation', time: 'Just now' }, ...prev])
    setCurrentSessionId(newId)
    setActiveChatSessionId(newId)
  }

  const handleSelectSession = (id) => {
    setCurrentSessionId(id)
    setActiveChatSessionId(id)
    setReports([]) // In a real app, fetch session history here
  }

  // ── Send / Submit ──
  const handleSubmit = (overrideQuery) => {
    const query = overrideQuery || input.trim()
    if (!query || askAIMutation.isPending) return

    setInput('')
    setErrorMessage('')
    const sessionId = currentSessionId ?? createSession(query)

    // Optimistic user report structure (could be refined, but we just want to trigger the AI response)
    // Actually, user messages don't need a full report card. We'll just show the reports from the AI.
    // The query is included in the AI report banner anyway.
    // But to show a loading state, we can add a temporary loading report.

    // We only render AI reports, since the user query is clearly stated in the report banner.

    askAIMutation.mutate(
      { sessionId, question: query },
      {
        onSuccess: (response) => {
          const newReport = buildReport(query, response)
          setReports((prev) => [...prev, newReport])
        },
        onError: (error) => {
          setErrorMessage(error.message || 'Unable to retrieve investigation data. Please try again.')
        },
      }
    )
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleSubmit()
  }

  const activeSessionTitle = isWelcomeState 
    ? 'Ready — begin a new investigation'
    : sessions.find((s) => s.id === currentSessionId)?.title || 'Active Investigation'

  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090f] overflow-hidden fixed inset-0 z-50">
      
      {/* ── TOP HEADER ── */}
      <WorkspaceHeader activeSessionTitle={activeSessionTitle} />

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL — History Sidebar ── */}
        <InvestigationHistorySidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          sessionSearch={sessionSearch}
          setSessionSearch={setSessionSearch}
          onCreateSession={handleCreateSession}
          onSelectSession={handleSelectSession}
          isWelcomeState={isWelcomeState}
        />

        {/* ── MAIN WORKSPACE ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
          
          <AnimatePresence mode="wait">
            {isWelcomeState ? (
              /* ── STATE A: WELCOME CONSOLE ── */
              <WelcomeConsole
                key="welcome"
                input={input}
                setInput={setInput}
                onSubmit={() => handleSubmit()}
                isPending={askAIMutation.isPending}
              />
            ) : (
              /* ── STATE B: ACTIVE INVESTIGATION ── */
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Reports Scroll Area */}
                <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
                  <div className="max-w-6xl mx-auto flex flex-col items-center">
                    {reports.map((report, i) => (
                      <InvestigationReportCard
                        key={report.id || i}
                        report={report}
                        onSelectFollowUp={(q) => handleSubmit(q)}
                      />
                    ))}

                    {/* Loading Indicator */}
                    {askAIMutation.isPending && (
                      <div className="w-full max-w-6xl bg-[#0a0d14] border border-[#1e2d3d] rounded-sm p-8 flex flex-col items-center justify-center shadow-lg animate-pulse">
                        <Loader2 className="w-6 h-6 text-[#2563eb] animate-spin mb-4" />
                        <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                          Generating Official Intelligence Report
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 mt-2">
                          Reasoning across case database and evidence records...
                        </span>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Docked Search Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#07090f] via-[#07090f] to-transparent pointer-events-none">
                  <div className="max-w-4xl mx-auto pointer-events-auto shadow-2xl shadow-[#07090f]">
                    <form onSubmit={handleFormSubmit} className="relative flex items-stretch w-full rounded-sm">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Continue investigation — ask a follow-up question..."
                        disabled={askAIMutation.isPending}
                        className="flex-1 bg-[#0a0d14] border border-[#1e2d3d] focus:border-[#2563eb]/60 focus:outline-none rounded-l-sm px-5 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition-colors disabled:opacity-50 font-sans"
                      />
                      <button
                        type="submit"
                        disabled={askAIMutation.isPending || !input.trim()}
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-r-sm flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer shrink-0 border border-[#2563eb]"
                      >
                        {askAIMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </form>
                    <p className="text-[9px] font-mono text-slate-600 mt-3 text-center">
                      Llama-3.3-70B · Multi-Agent RAG · LangGraph · Groq Cloud
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errorMessage && (
            <div className="absolute left-6 right-6 top-4 z-10 rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-center font-mono text-xs text-red-300">
              {errorMessage}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
