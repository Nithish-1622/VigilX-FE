import React, { useState } from 'react'
import { Cpu, Send, Plus, Search, MessageSquare, ShieldAlert, BookOpen, AlertCircle, HelpCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: { source: string; ref: string }[]
  confidence?: 'low' | 'medium' | 'high'
}

export const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'user',
      content: 'Where does John Doe live?'
    },
    {
      role: 'assistant',
      content: 'John Doe lives at No. 5, 2nd Cross, Koramangala.',
      confidence: 'high',
      citations: [
        { source: 'accused_records', ref: 'ACC_2001' },
        { source: 'case_files', ref: 'CASE_1001' }
      ]
    }
  ])
  const [input, setInput] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMsgs = [...messages, { role: 'user', content: input } as Message]
    setMessages(newMsgs)
    setInput('')

    // Mock AI response
    setTimeout(() => {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: `AI Analysis running for query: "${input}". The FastAPI Agentic Reasoning orchestrator is analyzing relational databases and documents...`,
          confidence: 'medium',
          citations: [{ source: 'django_api', ref: 'DB_QUERY' }]
        }
      ])
    }, 1000)
  }

  const suggestedQuestions = [
    'What is John Does criminal history?',
    'List all evidence associated with this suspect',
    'Summarize FIR-123 case details'
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-vigilx-card border border-vigilx-borderMuted rounded-sm overflow-hidden select-none">
      
      {/* 1. Chat Sessions Sidebar */}
      <aside className="w-64 border-r border-vigilx-borderMuted bg-[#0d111a] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-4 space-y-4">
          
          {/* New Session Button */}
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-950/20 border border-vigilx-borderActive hover:bg-indigo-950/40 text-vigilx-primary py-2 px-4 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>New Investigation</span>
          </button>

          {/* Search Sessions */}
          <div className="relative">
            <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm py-1.5 pl-8 pr-3 text-[11px] text-slate-300 placeholder-slate-600 font-mono"
            />
          </div>

          {/* Session List */}
          <div className="space-y-1.5 pt-2">
            <div className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase px-1">
              Active Session
            </div>
            <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-200 bg-[#111622] border border-vigilx-borderMuted rounded-sm text-left font-mono">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Case summary John Doe</span>
            </button>

            <div className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase px-1 pt-4">
              Past Sessions
            </div>
            <div className="space-y-1">
              {['Burglary evidence', 'Cyber fraud suspects', 'Koramangala telemetry'].map((s, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-[#111622]/40 rounded-sm text-left font-mono truncate"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Info label */}
        <div className="p-3 border-t border-vigilx-borderMuted text-[9px] text-slate-500 font-mono flex items-center gap-1.5 bg-[#080b11]">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
          <span>SESSION_ID: chatbot-101</span>
        </div>
      </aside>

      {/* 2. Main Chat Workspace */}
      <section className="flex-1 flex flex-col justify-between bg-[#080a0f] overflow-hidden">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-vigilx-borderMuted pb-3">
            <Cpu className="w-4 h-4 text-vigilx-primary animate-pulse" />
            <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase">
              VigilX AI Intelligence Core
            </h2>
            <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 px-1.5 border border-indigo-900 rounded-sm ml-auto">
              Llama-3.3-70B RAG Active
            </span>
          </div>

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                } space-y-1.5`}
              >
                {/* Username Header */}
                <span className="text-[10px] font-mono text-slate-500 uppercase px-1">
                  {msg.role === 'user' ? 'Investigating Officer' : 'AI Assistant Agent'}
                </span>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 text-xs leading-relaxed rounded-sm border ${
                    msg.role === 'user'
                      ? 'bg-indigo-950/15 border-vigilx-borderActive text-indigo-200'
                      : 'bg-vigilx-card border-vigilx-borderMuted text-slate-200 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Assistant Extra UI: Citations & Confidence */}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-2.5 border-t border-vigilx-borderMuted/40 flex flex-wrap gap-2 items-center justify-between">
                      {/* Citations */}
                      {msg.citations && (
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 text-slate-500" />
                          <span className="text-[9px] font-mono text-slate-500">Citations:</span>
                          {msg.citations.map((c, cIdx) => (
                            <span
                              key={cIdx}
                              title={`Inspect snippet from ${c.source}`}
                              className="text-[9px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-900 px-1.5 py-0.5 rounded-sm cursor-pointer hover:border-vigilx-primary"
                            >
                              {c.ref}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Confidence */}
                      {msg.confidence && (
                        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500 ml-auto">
                          <AlertCircle className="w-3 h-3 text-indigo-400" />
                          <span>CONFIDENCE:</span>
                          <span className="text-emerald-400 font-bold">{msg.confidence.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input area, suggested queries, and disclaimer */}
        <div className="p-4 bg-[#0d111a] border-t border-vigilx-borderMuted space-y-3">
          
          {/* Suggested followups */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Follow-ups:
            </span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="text-[10px] bg-slate-900 border border-vigilx-borderMuted hover:border-vigilx-borderActive hover:text-slate-200 text-slate-400 px-2.5 py-1 rounded-sm transition-all cursor-pointer font-mono"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI agent for reasoning links, query coordinates, or audit logs..."
              className="flex-1 bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm px-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 transition-colors"
            />
            <button
              type="submit"
              className="bg-vigilx-primary hover:bg-[#2563eb] text-white p-2 rounded-sm transition-colors flex items-center justify-center cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </section>

    </div>
  )
}
