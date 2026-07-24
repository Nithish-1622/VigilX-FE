import { useState } from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, Play, BarChart2, GitBranch, Lock } from 'lucide-react'

const EXPERIMENTS = [
  { id: 1, name: 'Prompt Strategy A/B Test', desc: 'Compare accuracy of PlanningAgent with different system prompts.', status: 'ready' },
  { id: 2, name: 'Agent Configuration Alpha', desc: 'Test 5-agent pipeline vs 7-agent full pipeline on narcotics cases.', status: 'draft' },
]

const SIMULATIONS = [
  { id: 1, name: 'Harbor District — Gang Activity Surge', desc: 'Simulate 30% increase in gang activity based on Q2 historical data.', status: 'ready' },
  { id: 2, name: 'Narcotics Network Disruption', desc: 'What-if: Remove top 3 nodes from trafficking network.', status: 'draft' },
]

export default function ExperimentalStudio() {
  const [tab, setTab] = useState('experiment')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">Experimental Studio</h1>
        <span className="tag-red flex items-center gap-1.5">
          <FlaskConical size={10} /> Beta
        </span>
      </div>
      <p className="text-sm text-text-secondary -mt-4">Sandbox environment for investigative modeling, A/B testing, and simulations.</p>

      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
        {[{ id: 'experiment', label: 'Experiments', icon: GitBranch }, { id: 'simulation', label: 'Simulations', icon: BarChart2 }].map((t) => (
          <button
            key={t.id}
            id={`exp-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: tab === t.id ? 'rgba(255,159,10,0.12)' : 'transparent',
              color: tab === t.id ? 'var(--accent-orange)' : 'var(--text-secondary)',
              border: tab === t.id ? '1px solid rgba(255,159,10,0.2)' : '1px solid transparent',
            }}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {(tab === 'experiment' ? EXPERIMENTS : SIMULATIONS).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-5 mb-3 flex items-center gap-4"
            style={{ border: '1px solid rgba(255,159,10,0.1)' }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,159,10,0.1)', border: '1px solid rgba(255,159,10,0.2)' }}
            >
              <FlaskConical size={18} className="text-accent-orange" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </div>
            <span className={item.status === 'ready' ? 'tag-green' : 'tag-cyan'} style={{ textTransform: 'capitalize' }}>
              {item.status}
            </span>
            <button className="btn-cyber px-3 py-1.5 text-xs flex items-center gap-1.5">
              <Play size={11} /> Run
            </button>
          </motion.div>
        ))}

        {/* Coming soon overlay */}
        <div className="glass rounded-xl p-6 mt-4 text-center" style={{ border: '1px solid rgba(255,159,10,0.1)' }}>
          <Lock size={20} className="text-text-muted mx-auto mb-2" />
          <p className="text-xs text-text-muted">Advanced simulation engine — coming in the next release.</p>
        </div>
      </motion.div>
    </div>
  )
}
