import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { MapPin, Layers } from 'lucide-react'
import { getGeography } from '../../api/vigilx'

const MOCK_HOTSPOTS = [
  { lat: 40.7128, lng: -74.006, intensity: 0.9, type: 'Violent Crime', count: 42, district: 'Manhattan South' },
  { lat: 40.7282, lng: -73.9942, intensity: 0.7, type: 'Drug Activity', count: 31, district: 'Lower East' },
  { lat: 40.6892, lng: -74.0445, intensity: 0.85, type: 'Robbery', count: 38, district: 'Brooklyn Heights' },
  { lat: 40.7484, lng: -73.9967, intensity: 0.6, type: 'Cyber Fraud', count: 22, district: 'Midtown' },
  { lat: 40.7614, lng: -73.9776, intensity: 0.75, type: 'Gang Activity', count: 29, district: 'Upper East' },
  { lat: 40.7051, lng: -74.0087, intensity: 0.5, type: 'Vehicle Crime', count: 18, district: 'Financial District' },
  { lat: 40.6782, lng: -73.9442, intensity: 0.65, type: 'Violent Crime', count: 25, district: 'Crown Heights' },
  { lat: 40.7411, lng: -74.0018, intensity: 0.4, type: 'Narcotics', count: 15, district: 'Chelsea' },
]

const getColor = (intensity) => {
  if (intensity >= 0.85) return '#FF3B30'
  if (intensity >= 0.65) return '#FF9F0A'
  if (intensity >= 0.45) return '#FFD60A'
  return '#30D158'
}

export default function HotspotMap() {
  const [hotspots, setHotspots] = useState(MOCK_HOTSPOTS)
  const [mapLayer, setMapLayer] = useState('dark')

  useEffect(() => {
    getGeography()
      .then((data) => {
        if (data?.hotspots) setHotspots(data.hotspots)
      })
      .catch(() => {}) // Use mock on error
  }, [])

  const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

  return (
    <div className="glass" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(33,38,45,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <MapPin size={15} style={{ color:'#FF3B30' }} />
          <h2 style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>Crime Hotspot Map</h2>
          <span className="tag-red">{hotspots.length} Active Clusters</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-muted)' }}>
          <Layers size={11} />
          Live Feed
        </div>
      </div>

      <div style={{ height: 320, position: 'relative' }}>
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={11}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url={tileUrl} />
          {hotspots.map((h, i) => (
            <CircleMarker
              key={i}
              center={[h.lat, h.lng]}
              radius={10 + h.intensity * 16}
              pathOptions={{
                color: getColor(h.intensity),
                fillColor: getColor(h.intensity),
                fillOpacity: 0.35,
                weight: 1.5,
              }}
            >
              <Popup className="leaflet-popup-dark">
                <div className="p-2 text-xs text-white" style={{ background: 'transparent' }}>
                  <p className="font-bold mb-1" style={{ color: getColor(h.intensity) }}>{h.type}</p>
                  <p className="text-gray-300">{h.district}</p>
                  <p className="text-gray-400 mt-1">Incidents: <span className="text-white font-semibold">{h.count}</span></p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Scan overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'linear-gradient(rgba(0,240,255,0.02) 1px, transparent 1px)', backgroundSize: '100% 40px' }}
        />
      </div>

      {/* Legend */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 16px', borderTop:'1px solid rgba(33,38,45,1)', fontSize:10, color:'var(--text-muted)', flexWrap:'wrap' }}>
        <span className="font-medium text-white text-xs">Severity:</span>
        {[
          { color: '#FF3B30', label: 'Critical (≥85%)' },
          { color: '#FF9F0A', label: 'High (≥65%)' },
          { color: '#FFD60A', label: 'Moderate' },
          { color: '#30D158', label: 'Low' },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  )
}
