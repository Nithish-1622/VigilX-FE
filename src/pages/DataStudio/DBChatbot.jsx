import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Database, Bot, Loader2, Trash2 } from 'lucide-react'

const EXAMPLES = [
  'Show me all tables related to narcotics',
  'List cases opened in the last 30 days',
  'Count suspects by district',
  'Find vehicles linked to Case #4421',
]

const MOCK_REPLIES = {
  default: (q) => `Query executed via Universal Adapter:\n\nSELECT * FROM intelligence_db WHERE context LIKE '%${q.split(' ').slice(-1)[0]}%' LIMIT 100;\n\n✓ Returned 47 rows from PostgreSQL adapter.\n\nTop results:\n• suspect_id: A-4421, name: Viktor M., district: Harbor\n• case_id: 9912, status: Active, severity: Critical\n• vehicle_reg: ZX-7742-B, linked_cases: 3`,
}

export default function DBChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      text: 'Universal DB Adapter connected. Ask me anything about your data — I can query PostgreSQL, MongoDB, Neo4j, and more.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
    setMessages((m) => [...m, { role: 'ai', text: MOCK_REPLIES.default(q) }])
    setLoading(false)
  }

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col" style={{ height: 480, border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-accent-purple" />
          <h2 className="text-sm font-semibold text-white">DB Adapter Chatbot</h2>
          <span className="tag-cyan">NL → SQL</span>
        </div>
        <button onClick={() => setMessages([messages[0]])} className="text-text-muted hover:text-accent-red transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role !== 'user' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(191,90,242,0.15)', border: '1px solid rgba(191,90,242,0.3)' }}
              >
                <Bot size={13} className="text-accent-purple" />
              </div>
            )}
            <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              {m.role === 'ai' ? (
                <pre className="whitespace-pre-wrap font-mono text-xs text-white/90 leading-relaxed">{m.text}</pre>
              ) : (
                <p>{m.text}</p>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <Loader2 size={12} className="animate-spin text-accent-purple" />
            Querying adapter...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Example Chips */}
      <div className="px-4 pb-2 flex gap-2 flex-wrap">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => { setInput(ex) }}
            className="text-[10px] px-2 py-1 rounded-md transition-all duration-150 hover:bg-bg-tertiary"
            style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about your data..."
          className="input-cyber flex-1 py-2.5"
        />
        <button
          id="db-send-btn"
          onClick={send}
          disabled={!input.trim() || loading}
          className="btn-solid-cyan px-4 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
