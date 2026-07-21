import React, { useEffect, useRef, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { Network, ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react'

// ─── Node color coding by type ───────────────────────────────────────────────
const NODE_COLORS = {
  suspect:  '#ef4444',  // Red
  fir:      '#3b82f6',  // Blue
  victim:   '#f59e0b',  // Amber
  evidence: '#8b5cf6',  // Purple
  location: '#10b981',  // Emerald
  officer:  '#6366f1',  // Indigo
  default:  '#64748b',  // Slate
}

const getNodeColor = (type) => NODE_COLORS[type?.toLowerCase()] || NODE_COLORS.default

// ─── Cytoscape stylesheet ─────────────────────────────────────────────────────
const buildStylesheet = () => [
  {
    selector: 'node',
    style: {
      'background-color': (ele) => getNodeColor(ele.data('type')),
      'label': 'data(label)',
      'color': '#f1f5f9',
      'font-size': '10px',
      'font-family': 'JetBrains Mono, monospace',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': '4px',
      'width': '28px',
      'height': '28px',
      'border-width': '2px',
      'border-color': 'rgba(255,255,255,0.08)',
      'text-outline-width': '2px',
      'text-outline-color': '#07090f',
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': '2.5px',
      'border-color': '#ffffff',
      'width': '34px',
      'height': '34px',
    },
  },
  {
    selector: 'node:active',
    style: { 'overlay-color': 'transparent', 'overlay-opacity': 0 },
  },
  {
    selector: 'edge',
    style: {
      'width': 1.2,
      'line-color': '#1e2d3d',
      'target-arrow-color': '#1e2d3d',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'label': 'data(label)',
      'color': '#475569',
      'font-size': '8px',
      'font-family': 'JetBrains Mono, monospace',
      'text-rotation': 'autorotate',
      'text-margin-y': '-6px',
      'text-outline-width': '2px',
      'text-outline-color': '#07090f',
    },
  },
  {
    selector: 'edge:selected',
    style: {
      'line-color': '#2563eb',
      'target-arrow-color': '#2563eb',
      'width': 2,
    },
  },
]

// ─── Mock graph data for dev mode ─────────────────────────────────────────────
export const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'suspect-1', label: 'John Doe', type: 'suspect' },
    { id: 'fir-123',   label: 'FIR-123',  type: 'fir' },
    { id: 'victim-1',  label: 'Jane Smith',type: 'victim' },
    { id: 'loc-1',     label: 'Koramangala',type: 'location' },
    { id: 'evidence-1',label: 'CCTV #12', type: 'evidence' },
    { id: 'evidence-2',label: 'Witness Statement', type: 'evidence' },
  ],
  edges: [
    { source: 'suspect-1',  target: 'fir-123',    label: 'accused_in' },
    { source: 'victim-1',   target: 'fir-123',    label: 'victim_in' },
    { source: 'fir-123',    target: 'loc-1',      label: 'occurred_at' },
    { source: 'evidence-1', target: 'fir-123',    label: 'links_to' },
    { source: 'evidence-2', target: 'suspect-1',  label: 'implicates' },
  ],
}

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND_ITEMS = [
  { type: 'suspect',  label: 'Suspect' },
  { type: 'fir',      label: 'Case/FIR' },
  { type: 'victim',   label: 'Victim' },
  { type: 'evidence', label: 'Evidence' },
  { type: 'location', label: 'Location' },
  { type: 'officer',  label: 'Officer' },
]

// ─── Main GraphPanel component ────────────────────────────────────────────────
export const GraphPanel = ({ graphData }) => {
  const cyRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [showLegend, setShowLegend] = useState(false)

  const data = graphData || MOCK_GRAPH_DATA

  // Build Cytoscape elements
  const elements = [
    ...data.nodes.map((n) => ({
      data: { id: n.id, label: n.label, type: n.type },
    })),
    ...data.edges.map((e, i) => ({
      data: {
        id: `edge-${i}`,
        source: e.source,
        target: e.target,
        label: e.label,
      },
    })),
  ]

  const handleCyInit = (cy) => {
    cyRef.current = cy

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const node = evt.target
      setSelectedNode({
        id: node.id(),
        label: node.data('label'),
        type: node.data('type'),
        degree: node.degree(),
      })
      // Highlight connected edges
      cy.elements().removeClass('highlighted dimmed')
      node.neighborhood().addClass('highlighted')
      cy.elements().not(node.neighborhood()).not(node).addClass('dimmed')
      node.addClass('highlighted')
    })

    // Tap canvas to clear selection
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted dimmed')
        setSelectedNode(null)
      }
    })
  }

  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.3)
  }
  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.7)
  }
  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 20)
  }

  return (
    <div className="flex flex-col h-full bg-[#07090f] relative overflow-hidden">

      {/* Graph Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 bg-[#0d1117] border border-[#1e2d3d] hover:border-[#2563eb]/50 rounded-sm flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 bg-[#0d1117] border border-[#1e2d3d] hover:border-[#2563eb]/50 rounded-sm flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          className="w-7 h-7 bg-[#0d1117] border border-[#1e2d3d] hover:border-[#2563eb]/50 rounded-sm flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          title="Fit to Screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setShowLegend((v) => !v)}
          className={`w-7 h-7 bg-[#0d1117] border rounded-sm flex items-center justify-center transition-colors cursor-pointer ${
            showLegend ? 'border-[#2563eb]/60 text-[#2563eb]' : 'border-[#1e2d3d] text-slate-500 hover:text-slate-300'
          }`}
          title="Legend"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="absolute top-2 left-2 z-10 bg-[#0d1117] border border-[#1e2d3d] rounded-sm p-2.5 space-y-1.5 min-w-[120px]">
          <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Node Types</p>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getNodeColor(item.type) }}
              />
              <span className="text-[10px] font-mono text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Cytoscape Canvas */}
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        cy={handleCyInit}
        stylesheet={buildStylesheet()}
        layout={{
          name: 'cose',
          animate: true,
          animationDuration: 500,
          nodeRepulsion: 4500,
          idealEdgeLength: 80,
          gravity: 0.25,
          padding: 20,
        }}
        userZoomingEnabled={true}
        userPanningEnabled={true}
        boxSelectionEnabled={false}
      />

      {/* Selected Node Detail */}
      {selectedNode && (
        <div className="absolute bottom-2 left-2 right-2 z-10 bg-[#0d1117] border border-[#1e2d3d] rounded-sm p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: getNodeColor(selectedNode.type) }}
            />
            <span className="text-xs font-semibold text-slate-200">{selectedNode.label}</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-mono text-slate-500">
            <span>TYPE: {selectedNode.type?.toUpperCase() || 'UNKNOWN'}</span>
            <span>CONNECTIONS: {selectedNode.degree}</span>
            <span>ID: {selectedNode.id}</span>
          </div>
        </div>
      )}
    </div>
  )
}
