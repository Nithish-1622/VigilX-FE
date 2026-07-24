import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, Loader2, Zap } from 'lucide-react'
import useChatStore from '../../store/useChatStore'

const STARTERS = [
  'Who are the top suspects in the narcotics case?',
  'Show me criminal network activity in Harbor district',
  'What are the trends in violent crime this month?',
]

export default function ChatV1() {
  const { v1Messages, v1Loading, sendV1Message, clearV1 } = useChatStore()
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [v1Messages, v1Loading])

  const send = () => {
    const q = input.trim()
    if (!q || v1Loading) return
    setInput('')
    sendV1Message(q)
  }

  return (
    <div className="glass" style={{ borderRadius: 14, overflow: 'hidden', display:'flex', flexDirection:'column', height:'calc(100vh - 56px - 48px - 130px)', minHeight: 480, border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.25)' }}
          >
            <Bot size={15} className="text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">VigilX V1</h3>
            <p className="text-[10px] text-text-muted">Conversational AI · Standard LLM</p>
          </div>
        </div>
        <button onClick={clearV1} className="text-text-muted hover:text-accent-red transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {v1Messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.15)' }}
            >
              <Zap size={28} className="text-accent-cyan" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">VigilX V1 Ready</h3>
            <p className="text-xs text-text-muted mb-5">Standard LLM interface. Ask anything about your cases.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s) }}
                  className="text-xs px-3 py-1.5 rounded-lg text-text-secondary hover:text-white transition-all"
                  style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid var(--border-active)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {v1Messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'ai' && (
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' }}
              >
                <Bot size={13} className="text-accent-cyan" />
              </div>
            )}
            <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              {m.text}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: 'linear-gradient(135deg, #BF5AF2, #8B5CF6)' }}
              >
                <User size={13} className="text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {v1Loading && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' }}
            >
              <Loader2 size={13} className="text-accent-cyan animate-spin" />
            </div>
            <span>VigilX V1 is thinking...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-3 border-t border-border-subtle flex gap-3 flex-shrink-0">
        <input
          id="v1-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask the AI anything..."
          className="input-cyber flex-1"
        />
        <button
          id="v1-send-btn"
          onClick={send}
          disabled={!input.trim() || v1Loading}
          className="btn-solid-cyan px-4 rounded-lg flex items-center gap-2 disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
