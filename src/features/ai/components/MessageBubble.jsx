import React from 'react'

const CONFIDENCE_STYLES = {
  high: 'text-emerald-400',
  medium: 'text-amber-400',
  low: 'text-red-400',
}

export const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}>
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-1">
        {isUser ? 'Investigating Officer' : 'VigilX AI Agent'}
      </span>

      <div
        className={`max-w-[85%] text-xs leading-relaxed rounded-sm border ${
          isUser
            ? 'bg-[#0f1d35] border-[#1e3a6e]/40 text-slate-200 px-4 py-2.5'
            : 'bg-[#111827] border-[#1e2d3d] text-slate-200 px-4 py-3 shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>

        {/* Assistant footer — citations + confidence */}
        {!isUser && (msg.citations?.length > 0 || msg.confidence) && (
          <div className="mt-2.5 pt-2 border-t border-[#1e2d3d]/60 flex flex-wrap gap-2 items-center">
            {msg.citations?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {msg.citations.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono bg-blue-950/40 text-blue-300 border border-blue-900/40 px-1.5 py-0.5 rounded-sm"
                  >
                    {c.source}
                  </span>
                ))}
              </div>
            )}
            {msg.confidence && (
              <span className={`text-[9px] font-mono ml-auto ${CONFIDENCE_STYLES[msg.confidence] || 'text-slate-400'}`}>
                {msg.confidence.toUpperCase()} CONFIDENCE
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
