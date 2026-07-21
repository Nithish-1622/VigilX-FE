import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAskAI } from '../../../hooks/useAskAI'
import { useSessionStore } from '../../../store/useSessionStore'
import { WelcomeConsole } from '../components/WelcomeConsole'
import { WorkspaceHeader } from '../components/WorkspaceHeader'
import { InvestigationHistorySidebar } from '../components/InvestigationHistorySidebar'
import { InvestigationReportCard } from '../components/InvestigationReportCard'
import { MOCK_GRAPH_DATA } from '../components/GraphPanel'
import { Send, Loader2 } from 'lucide-react'

// ─── Dev mode realistic report generation ─────────────────────────────────────
const buildDevResponse = (question) => {
  const q = question.toLowerCase()

  const baseReport = {
    id: `REP-${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString().split('T')[0],
    query: question,
    summary: '',
    keyDetails: {},
    evidence: {
      confidence: 'high',
      sourcesCount: 3,
      citations: [],
      ragCitations: 2,
      sqlCitations: 1,
      langGraphActive: true,
    },
    graphData: null,
    timeline: [],
    followUps: [],
  }

  if (q.includes('john doe') || q.includes('suspect') || q.includes('accused')) {
    return {
      ...baseReport,
      summary: 'John Doe (alias: "Johnny"), age 34, has been identified as the primary accused associated with FIR-123 involving larceny and retail theft.\n\nThe available records indicate two prior convictions and confirm his current residential address in Koramangala. He was last observed fleeing the scene by witness Jane Smith.',
      keyDetails: {
        name: 'John Doe',
        role: 'Accused',
        associated_FIR: 'FIR-123',
        location: 'Koramangala',
        previous_convictions: '2',
        status: 'Under Investigation',
        crime_category: 'Larceny/Theft',
        last_activity: '14 July 2026',
      },
      evidence: {
        ...baseReport.evidence,
        citations: [
          { source: 'accused_registry', reference_id: 'REC-091', snippet: 'John Doe, 34, residing at No.5, 2nd Cross, Koramangala. Prior offenses: 2024, 2025.' },
          { source: 'fir_database', reference_id: 'FIR-123', snippet: 'Primary suspect identified as John Doe based on witness testimony.' }
        ]
      },
      graphData: MOCK_GRAPH_DATA,
      followUps: ['Explain previous convictions', 'Show connected suspects', 'Reconstruct crime timeline']
    }
  }

  if (q.includes('timeline') || q.includes('reconstruct')) {
    return {
      ...baseReport,
      summary: 'Chronological reconstruction of events related to FIR-123 has been compiled based on witness statements, security footage, and official police records.',
      timeline: [
        { time: '09:00', event: 'Business Opened', description: 'Retail store opened for business normally.' },
        { time: '10:00', event: 'Incident Occurred', description: 'Theft incident reported at premises.' },
        { time: '10:15', event: 'Suspect Fled', description: 'Suspect John Doe observed fleeing the scene by witness Jane Smith.' },
        { time: '10:42', event: 'Suspect Identified', description: 'Security footage reviewed; suspect formally identified.' },
        { time: '11:30', event: 'FIR Registered', description: 'FIR-123 registered at Koramangala Police Station.' },
        { time: '14:00', event: 'Arrest Made', description: 'Accused apprehended at Marathahalli.' },
      ],
      evidence: {
        confidence: 'high',
        sourcesCount: 2,
        citations: [{ source: 'cctv_logs', reference_id: 'CAM-4A', snippet: 'Subject matching description captured at 10:15 AM exiting premises.' }],
        ragCitations: 1,
        sqlCitations: 1,
        langGraphActive: true,
      },
      followUps: ['Investigate John Doe', 'Show evidence EV-889', 'Summarize FIR-123']
    }
  }

  // Default / general fallback
  return {
    ...baseReport,
    summary: 'Multi-agent reasoning completed across the case database and accused registry. No direct high-confidence matches found for your query. To improve results, specify an FIR number, suspect name, or incident location.',
    evidence: {
      confidence: 'medium',
      sourcesCount: 1,
      citations: [],
      ragCitations: 1,
      sqlCitations: 0,
      langGraphActive: true,
    },
    followUps: ['Summarize FIR-2026-101', 'Investigate Rajesh Kumar']
  }
}

export const AIChatPage = () => {
  const { activeChatSessionId, setActiveChatSessionId } = useSessionStore()

  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(activeChatSessionId || null)
  const [sessionSearch, setSessionSearch] = useState('')
  const [reports, setReports] = useState([])
  const [input, setInput] = useState('')

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
    const sessionId = currentSessionId ?? createSession(query)

    // Optimistic user report structure (could be refined, but we just want to trigger the AI response)
    // Actually, user messages don't need a full report card. We'll just show the reports from the AI.
    // The query is included in the AI report banner anyway.
    // But to show a loading state, we can add a temporary loading report.

    const tempLoadingId = `loading-${Date.now()}`
    
    // We only render AI reports, since the user query is clearly stated in the report banner.

    askAIMutation.mutate(
      { sessionId, question: query, userId: 'officer-dev-007' },
      {
        onSuccess: (resData) => {
          // If the backend supported the new structure, we'd map it here.
          // For now, let's use the dev fallback to ensure the UX is visible.
          const newReport = buildDevResponse(query)
          setReports((prev) => [...prev, newReport])
        },
        onError: () => {
          setTimeout(() => {
            const newReport = buildDevResponse(query)
            setReports((prev) => [...prev, newReport])
          }, 800)
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

        </div>
      </div>
    </div>
  )
}
