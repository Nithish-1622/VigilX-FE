import { useEffect, useRef, useState } from 'react'
import { ShieldAlert, Layers } from 'lucide-react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// ─── Karnataka State Police (KSP) Incident Hotspots ───────────────────────────
const KARNATAKA_INCIDENTS = [
  { lon: 77.5946, lat: 12.9716, weight: 1.0,  type: 'Cyber Fraud',    label: 'Bengaluru Central HQ',    severity: 'critical', district: 'Bengaluru Urban' },
  { lon: 77.6412, lat: 12.9784, weight: 0.85, type: 'Financial AML',  label: 'Indiranagar Cyber Cell', severity: 'high',     district: 'Bengaluru East' },
  { lon: 77.6245, lat: 12.9352, weight: 0.9,  type: 'Cyber Crime',   label: 'Koramangala Tech Zone',   severity: 'critical', district: 'Bengaluru South' },
  { lon: 77.5736, lat: 13.0084, weight: 0.7,  type: 'Narcotics',     label: 'Malleswaram Precinct',    severity: 'high',     district: 'Bengaluru North' },
  { lon: 76.6394, lat: 12.3052, weight: 0.75, type: 'Property Theft', label: 'Mysuru City Precinct 2', severity: 'medium',   district: 'Mysuru Division' },
  { lon: 75.1240, lat: 15.3647, weight: 0.8,  type: 'Gang Activity', label: 'Hubballi Station 4',      severity: 'high',     district: 'Dharwad Zone' },
  { lon: 74.8560, lat: 12.9141, weight: 0.65, type: 'Smuggling',     label: 'Mangaluru Coastal Post', severity: 'medium',   district: 'Dakshina Kannada' },
  { lon: 74.5085, lat: 15.8497, weight: 0.85, type: 'Cross Border',   label: 'Belagavi Border Outpost', severity: 'critical', district: 'Belagavi Range' },
  { lon: 76.8343, lat: 17.3297, weight: 0.7,  type: 'Financial AML',  label: 'Kalaburagi East Station', severity: 'high',     district: 'Kalaburagi Range' },
  { lon: 75.5681, lat: 13.9299, weight: 0.5,  type: 'Illicit Trade',  label: 'Shivamogga Central',     severity: 'medium',   district: 'Shivamogga' },
]

const SEVERITY_COLORS = { critical: '#EF4444', high: '#F59E0B', medium: '#10B981' }

export default function HotspotMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const [mapError, setMapError] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let map = null
    try {
      if (!mapRef.current || mapInstance.current) return

      // Initialize MapLibre with Karnataka Bounds
      map = new maplibregl.Map({
        container: mapRef.current,
        style: {
          version: 8,
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap | KSP Intelligence',
            },
          },
          layers: [{
            id: 'osm',
            type: 'raster',
            source: 'osm-tiles',
            paint: {
              'raster-brightness-min': 0,
              'raster-brightness-max': 0.12,
              'raster-saturation': -0.85,
              'raster-contrast': 0.3,
              'raster-opacity': 0.75,
            },
          }],
        },
        center: [76.5, 14.5], // Center of Karnataka State
        zoom: 7.2,
        pitch: 25,
        antialias: true,
      })

      mapInstance.current = map

      map.on('load', () => {
        // Fit bounds to embrace all Karnataka Police points sharply
        const bounds = new maplibregl.LngLatBounds()
        KARNATAKA_INCIDENTS.forEach(inc => bounds.extend([inc.lon, inc.lat]))
        map.fitBounds(bounds, { padding: 45, maxZoom: 12, duration: 1200 })

        // Clear existing DOM markers
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        // Render Pinpointed HTML Pin Markers with Glowing Pulse Rings
        KARNATAKA_INCIDENTS.forEach((inc) => {
          const color = SEVERITY_COLORS[inc.severity] || '#00C8F0'

          // Create Custom Pin Element
          const el = document.createElement('div')
          el.className = 'ksp-pin-marker'
          el.style.cssText = `
            position: relative;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -100%);
            z-index: 10;
          `

          // Inner HTML: Pin Icon + Label Badge + Pulse Ring
          el.innerHTML = `
            <div style="
              background: rgba(6, 8, 12, 0.95);
              border: 1px solid ${color};
              color: #FFFFFF;
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              font-weight: 800;
              padding: 2px 7px;
              border-radius: 12px;
              white-space: nowrap;
              margin-bottom: 4px;
              box-shadow: 0 0 12px ${color}80;
              letter-spacing: 0.04em;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="width: 5px; height: 5px; border-radius: 50%; background: ${color}; display: inline-block;"></span>
              ${inc.label}
            </div>

            <div style="position: relative; width: 26px; height: 32px; display: flex; align-items: center; justify-content: center;">
              <!-- Outer Glowing Pulse Ring -->
              <div style="
                position: absolute;
                bottom: 0;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${color}33;
                border: 1.5px solid ${color};
                animation: pulsePinRing 2s infinite;
              "></div>

              <!-- Pin Drop SVG Icon -->
              <svg width="24" height="30" viewBox="0 0 24 30" fill="none" style="position: relative; z-index: 2; filter: drop-shadow(0 2px 8px ${color}A0);">
                <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${color}"/>
                <circle cx="12" cy="11" r="5" fill="#06080C"/>
              </svg>
            </div>
          `

          el.addEventListener('click', () => {
            setSelected(inc)
            map.flyTo({ center: [inc.lon, inc.lat], zoom: 13, duration: 800 })
          })

          const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([inc.lon, inc.lat])
            .addTo(map)

          markersRef.current.push(marker)
        })
      })

    } catch (err) {
      console.error('[KSP Map Error]', err)
      setMapError(true)
    }

    return () => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      if (map) {
        try { map.remove() } catch (e) {}
      }
      mapInstance.current = null
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-panel)', border: '1px solid rgba(0, 200, 240, 0.3)', borderRadius: 8, overflow: 'hidden' }}>
      
      {/* Dynamic Keyframes for Pulse Ring */}
      <style>{`
        @keyframes pulsePinRing {
          0% { transform: scale(0.8); opacity: 0.9; }
          70% { transform: scale(1.6); opacity: 0.1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: '#06080C', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={14} style={{ color: '#00C8F0' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>KARNATAKA POLICE (KSP) HOTSPOT MAP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-tertiary)' }}>{KARNATAKA_INCIDENTS.length} PINPOINTED LOCATIONS</span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
        </div>
      </div>

      {/* Map Body */}
      <div style={{ flex: 1, position: 'relative', minHeight: 280 }}>
        {mapError ? (
          <FallbackMap incidents={KARNATAKA_INCIDENTS} selected={selected} onSelect={setSelected} />
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}

        {/* Selected Incident Overlay Card */}
        {selected && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 20, background: 'rgba(10, 14, 22, 0.95)', border: '1px solid rgba(0, 200, 240, 0.4)', borderRadius: 8, padding: '10px 14px', minWidth: 220, backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: SEVERITY_COLORS[selected.severity] || '#00C8F0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                ● {selected.severity} SEVERITY
              </span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', margin: '2px 0' }}>{selected.label}</p>
            <p style={{ fontSize: 11, color: '#00C8F0', margin: 0, fontWeight: 600 }}>District: {selected.district}</p>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#94A3B8', display: 'block', marginTop: 4 }}>INCIDENT: {selected.type}</span>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#06080C', flexShrink: 0 }}>
        {Object.entries(SEVERITY_COLORS).map(([level, color]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Fallback Visual Component
function FallbackMap({ incidents, selected, onSelect }) {
  const W = 500, H = 280
  const lons = incidents.map(i => i.lon), lats = incidents.map(i => i.lat)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const pad = 45
  const toX = (lon) => pad + ((lon - minLon) / (maxLon - minLon)) * (W - pad * 2)
  const toY = (lat) => pad + (1 - (lat - minLat) / (maxLat - minLat)) * (H - pad * 2)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ background: '#06080C' }}>
      <text x={W/2} y={25} textAnchor="middle" fill="#00C8F0" fontSize="11" fontFamily="var(--mono)" fontWeight="bold">
        KARNATAKA STATE POLICE (KSP) GEOSPATIAL LOCATIONS
      </text>
      {incidents.map((inc, i) => (
        <g key={i} onClick={() => onSelect(inc)} style={{ cursor: 'pointer' }}>
          <circle cx={toX(inc.lon)} cy={toY(inc.lat)} r={7}
            fill={SEVERITY_COLORS[inc.severity] || '#888'}
            stroke="#FFFFFF" strokeWidth="1.5"
          />
          <text x={toX(inc.lon)} y={toY(inc.lat) - 10} textAnchor="middle" fill="#E8EDF5" fontSize="9" fontFamily="var(--mono)">
            {inc.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
