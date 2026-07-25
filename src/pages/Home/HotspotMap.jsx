import { useEffect, useRef, useState } from 'react'
import { Maximize2, Layers } from 'lucide-react'

const INCIDENTS = [
  { lon: -118.2437, lat: 34.0522, weight: 1.0, type: 'homicide',  label: 'Harbor District', severity: 'critical' },
  { lon: -118.2600, lat: 34.0600, weight: 0.8, type: 'narcotics', label: 'Sector 4 North',  severity: 'high' },
  { lon: -118.2200, lat: 34.0400, weight: 0.6, type: 'assault',   label: 'Downtown East',  severity: 'high' },
  { lon: -118.2800, lat: 34.0700, weight: 0.9, type: 'gang',      label: 'Harbor West',    severity: 'critical' },
  { lon: -118.2100, lat: 34.0650, weight: 0.4, type: 'theft',     label: 'Metro Core',     severity: 'medium' },
  { lon: -118.2550, lat: 34.0350, weight: 0.7, type: 'narcotics', label: 'Pier District',  severity: 'high' },
  { lon: -118.2700, lat: 34.0450, weight: 0.5, type: 'gang',      label: 'Sector 7',       severity: 'medium' },
  { lon: -118.2350, lat: 34.0750, weight: 0.85, type: 'homicide', label: 'North Harbor',   severity: 'critical' },
]

const SEVERITY_COLORS = { critical: '#E53E3E', high: '#D97706', medium: '#D4A800' }

export default function HotspotMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [mapError, setMapError] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let map = null
    const initMap = async () => {
      try {
        const maplibregl = (await import('maplibre-gl')).default
        await import('maplibre-gl/dist/maplibre-gl.css')

        if (!mapRef.current || mapInstance.current) return

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
                attribution: '© OpenStreetMap',
              },
            },
            layers: [{
              id: 'osm',
              type: 'raster',
              source: 'osm-tiles',
              paint: {
                'raster-brightness-min': 0,
                'raster-brightness-max': 0.12,
                'raster-saturation': -0.9,
                'raster-contrast': 0.2,
                'raster-opacity': 0.6,
              },
            }],
          },
          center: [-118.2437, 34.0522],
          zoom: 12,
          pitch: 35,
          bearing: -12,
          antialias: true,
        })

        mapInstance.current = map

        map.on('load', () => {
          // GeoJSON source for incidents
          map.addSource('incidents', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: INCIDENTS.map((inc, i) => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [inc.lon, inc.lat] },
                properties: { ...inc, id: i },
              })),
            },
          })

          // Heatmap layer
          map.addLayer({
            id: 'heatmap',
            type: 'heatmap',
            source: 'incidents',
            paint: {
              'heatmap-weight': ['get', 'weight'],
              'heatmap-intensity': 1.4,
              'heatmap-radius': 40,
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0,    'rgba(0,0,0,0)',
                0.2,  'rgba(139,92,246,0.4)',
                0.5,  'rgba(217,119,6,0.65)',
                0.8,  'rgba(229,62,62,0.8)',
                1.0,  'rgba(255,80,80,1)',
              ],
              'heatmap-opacity': 0.82,
            },
          })

          // Cluster source
          map.addSource('incident-points', {
            type: 'geojson',
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 45,
            data: {
              type: 'FeatureCollection',
              features: INCIDENTS.map((inc, i) => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [inc.lon, inc.lat] },
                properties: { ...inc, id: i },
              })),
            },
          })

          // Cluster circles
          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'incident-points',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': ['step', ['get', 'point_count'], '#D97706', 3, '#E53E3E', 6, '#9B1C1C'],
              'circle-radius': ['step', ['get', 'point_count'], 14, 3, 18, 6, 22],
              'circle-opacity': 0.85,
              'circle-stroke-width': 1,
              'circle-stroke-color': 'rgba(255,255,255,0.15)',
            },
          })

          // Unclustered incident markers
          map.addLayer({
            id: 'unclustered',
            type: 'circle',
            source: 'incident-points',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': ['match', ['get', 'severity'],
                'critical', '#E53E3E',
                'high',     '#D97706',
                '#D4A800',
              ],
              'circle-radius': 5,
              'circle-stroke-width': 1,
              'circle-stroke-color': 'rgba(255,255,255,0.3)',
              'circle-opacity': 0.9,
            },
          })

          // Click handler on unclustered points
          map.on('click', 'unclustered', (e) => {
            const props = e.features[0].properties
            setSelected(props)
            map.flyTo({
              center: e.features[0].geometry.coordinates,
              zoom: Math.max(map.getZoom(), 14),
              duration: 800,
              essential: true,
            })
          })

          map.on('mouseenter', 'unclustered', () => { map.getCanvas().style.cursor = 'pointer' })
          map.on('mouseleave', 'unclustered', () => { map.getCanvas().style.cursor = '' })
          map.on('mouseenter', 'clusters',    () => { map.getCanvas().style.cursor = 'pointer' })
          map.on('mouseleave', 'clusters',    () => { map.getCanvas().style.cursor = '' })

          // Expand cluster on click
          map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
            const clusterId = features[0].properties.cluster_id
            map.getSource('incident-points').getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return
              map.easeTo({ center: features[0].geometry.coordinates, zoom })
            })
          })
        })
      } catch (err) {
        console.error('MapLibre failed:', err)
        setMapError(true)
      }
    }

    initMap()
    return () => { if (map) map.remove(); mapInstance.current = null }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-dim)', borderRadius: 4, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border-dim)', background: 'var(--bg-row)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={12} style={{ color: 'var(--cyan)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Crime Hotspot Map</span>
          <span className="tag-cyan" style={{ fontSize: 9 }}>MapLibre GL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-tertiary)' }}>{INCIDENTS.length} INCIDENTS</span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulseDot 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 260 }}>
        {mapError ? (
          <FallbackMap incidents={INCIDENTS} selected={selected} onSelect={setSelected} />
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}

        {/* Selected incident overlay */}
        {selected && (
          <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 10, background: 'var(--bg-overlay)', border: '1px solid var(--border-base)', borderRadius: 3, padding: '8px 12px', minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: SEVERITY_COLORS[selected.severity] || 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {selected.severity}
              </span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{selected.label}</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{selected.type}</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 12px', borderTop: '1px solid var(--border-dim)', background: 'var(--bg-row)', flexShrink: 0 }}>
        {Object.entries(SEVERITY_COLORS).map(([level, color]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// SVG fallback when MapLibre unavailable
function FallbackMap({ incidents, selected, onSelect }) {
  const W = 500, H = 280
  const lons = incidents.map(i => i.lon), lats = incidents.map(i => i.lat)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const pad = 40
  const toX = (lon) => pad + ((lon - minLon) / (maxLon - minLon)) * (W - pad * 2)
  const toY = (lat) => pad + (1 - (lat - minLat) / (maxLat - minLat)) * (H - pad * 2)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ background: 'var(--bg-canvas)' }}>
      <text x={W/2} y={H/2-10} textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontFamily="var(--mono)">MapLibre unavailable — SVG fallback</text>
      {incidents.map((inc, i) => (
        <circle key={i} cx={toX(inc.lon)} cy={toY(inc.lat)} r={6 + inc.weight * 4}
          fill={SEVERITY_COLORS[inc.severity] || '#888'} opacity={0.7}
          style={{ cursor: 'pointer' }} onClick={() => onSelect(inc)}
        />
      ))}
    </svg>
  )
}
