import { motion } from 'framer-motion'
import { Brain, Lock, Upload, Play } from 'lucide-react'

export default function MLPage() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-8 text-center"
        style={{ border: '1px solid rgba(191,90,242,0.2)', background: 'rgba(191,90,242,0.04)' }}
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(191,90,242,0.12)', border: '1px solid rgba(191,90,242,0.3)' }}
        >
          <Brain size={36} className="text-accent-purple" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">ML Training Studio</h2>
        <p className="text-text-secondary mb-4">Custom model training pipeline for law enforcement AI</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
          style={{ background: 'rgba(191,90,242,0.1)', border: '1px solid rgba(191,90,242,0.2)', color: 'var(--accent-purple)' }}
        >
          <Lock size={14} /> Coming in Phase 5 — Under Development
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-40 pointer-events-none select-none">
        {[
          { icon: Upload, label: 'Dataset Upload', desc: 'Upload and label training datasets' },
          { icon: Brain, label: 'Model Config', desc: 'Configure architecture and hyperparameters' },
          { icon: Play, label: 'Training Job', desc: 'Launch and monitor training runs' },
        ].map((f) => (
          <div key={f.label} className="glass rounded-xl p-5">
            <f.icon size={20} className="text-accent-purple mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">{f.label}</h3>
            <p className="text-xs text-text-muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
