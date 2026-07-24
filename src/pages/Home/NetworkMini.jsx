import { useEffect, useRef, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { Network, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

const ELEMENTS = [
  // Main criminal nodes
  { data: { id: 'A', label: 'Viktor M.', type: 'boss', threat: 'critical', connections: 12 } },
  { data: { id: 'B', label: 'Sasha K.', type: 'lieutenant', threat: 'high', connections: 8 } },
  { data: { id: 'C', label: 'Dmitri V.', type: 'lieutenant', threat: 'high', connections: 7 } },
  { data: { id: 'D', label: 'Maria L.', type: 'associate', threat: 'medium', connections: 4 } },
  { data: { id: 'E', label: 'Omar N.', type: 'associate', threat: 'medium', connections: 5 } },
  { data: { id: 'F', label: 'Jin W.', type: 'associate', threat: 'low', connections: 3 } },
  { data: { id: 'G', label: 'Anna P.', type: 'associate', threat: 'medium', connections: 4 } },
  { data: { id: 'H', label: 'Carlos R.', type: 'associate', threat: 'low', connections: 2 } },
  // Edges
  { data: { source: 'A', target: 'B', weight: 3 } },
  { data: { source: 'A', target: 'C', weight: 3 } },
  { data: { source: 'B', target: 'D', weight: 2 } },
  { data: { source: 'B', target: 'E', weight: 2 } },
  { data: { source: 'C', target: 'F', weight: 1 } },
  { data: { source: 'C', target: 'G', weight: 2 } },
  { data: { source: 'D', target: 'H', weight: 1 } },
  { data: { source: 'E', target: 'G', weight: 1 } },
]

const STYLE = [
  {
    selector: 'node',
    style: {
      'background-color': '#1C2333',
      'border-width': 2,
      'border-color': '#30363D',
      label: 'data(label)',
      color: '#8B949E',
      'font-size': 9,
      'font-family': 'Inter, sans-serif',
      'text-valign': 'bottom',
      'text-margin-y': 4,
      width: 28,
      height: 28,
    },
  },
  {
    selector: 'node[threat="critical"]',
    style: {
      'background-color': 'rgba(255,59,48,0.2)',
      'border-color': '#FF3B30',
      'border-width': 2.5,
      color: '#FF3B30',
      width: 40,
      height: 40,
      'font-size': 10,
      'font-weight': 700,
    },
  },
  {
    selector: 'node[threat="high"]',
    style: {
      'background-color': 'rgba(255,159,10,0.15)',
      'border-color': '#FF9F0A',
      'border-width': 2,
      color: '#FF9F0A',
      width: 34,
      height: 34,
    },
  },
  {
    selector: 'node[threat="medium"]',
    style: {
      'background-color': 'rgba(0,240,255,0.1)',
      'border-color': '#00F0FF',
      color: '#00F0FF',
    },
  },
  {
    selector: 'node[threat="low"]',
    style: {
      'background-color': 'rgba(48,209,88,0.1)',
      'border-color': '#30D158',
      color: '#30D158',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 1,
      'line-color': '#21262D',
      'target-arrow-color': '#21262D',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.8,
      'curve-style': 'bezier',
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-color': '#BF5AF2',
      'border-width': 3,
      'box-shadow': '0 0 15px rgba(191,90,242,0.5)',
    },
  },
]

export default function NetworkMini() {
  const cyRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!cyRef.current) return
    const cy = cyRef.current
    cy.on('tap', 'node', (e) => {
      const node = e.target.data()
      setSelected(node)
    })
    cy.on('tap', (e) => {
      if (e.target === cy) setSelected(null)
    })
  }, [key])

  return (
    <div className="glass" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(33,38,45,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Network size={15} style={{ color:'#BF5AF2' }} />
          <h2 style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>Criminal Network</h2>
          <span className="tag-red">Top 5 Nodes</span>
        </div>
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{ color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer' }}
        >
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="relative" style={{ height: 280 }}>
        <CytoscapeComponent
          key={key}
          elements={ELEMENTS}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          stylesheet={STYLE}
          layout={{
            name: 'cose',
            animate: true,
            animationDuration: 600,
            nodeRepulsion: 8000,
            idealEdgeLength: 80,
            padding: 24,
          }}
          cy={(cy) => { cyRef.current = cy }}
        />
      </div>

      {/* Node Info Panel */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 p-3 rounded-lg text-xs"
          style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid var(--border-active)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white">{selected.label}</span>
            <span className={`tag-${selected.threat === 'critical' ? 'red' : selected.threat === 'high' ? 'red' : 'cyan'} capitalize`}>
              {selected.threat}
            </span>
          </div>
          <div className="flex gap-4 text-text-muted">
            <span>Role: <span className="text-white capitalize">{selected.type}</span></span>
            <span>Connections: <span className="text-accent-cyan">{selected.connections}</span></span>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 16px', fontSize:10, color:'var(--text-muted)', borderTop:'1px solid rgba(33,38,45,0.5)' }}>
        {[
          { color: '#FF3B30', label: 'Critical' },
          { color: '#FF9F0A', label: 'High' },
          { color: '#00F0FF', label: 'Medium' },
          { color: '#30D158', label: 'Low' },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  )
}
