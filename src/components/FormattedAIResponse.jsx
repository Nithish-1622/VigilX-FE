import React from 'react'
import {
  Shield,
  FileText,
  AlertTriangle,
  UserX,
  UserCheck,
  User,
  BadgeCheck,
  GitBranch,
  Clock,
  CheckCircle2,
  ChevronRight,
  Hash,
  MapPin,
  Calendar,
  Phone,
  Home,
  Info
} from 'lucide-react'
import { cleanText } from '../utils/sanitizeResponse'

// Helper to strip any remaining markdown asterisks from strings
function stripAsterisks(str) {
  if (!str || typeof str !== 'string') return ''
  return str.replace(/\*\*/g, '').replace(/^\*+\s*/, '').trim()
}

// Helper to format inline markdown bold/code/text cleanly without leaking literal **
function formatInlineMarkdown(text) {
  if (!text) return ''
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.map((part, idx) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const innerText = part.slice(2, -2).replace(/\*\*/g, '').trim()
      return (
        <strong key={idx} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {innerText}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={idx}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            padding: '2px 5px',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-base)',
            borderRadius: '3px',
            color: 'var(--cyan)'
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    // Clean any stray asterisks in regular text parts
    return part.replace(/\*\*/g, '')
  })
}

// Parses raw bullet points into key-value pairs or list items
function parseBullets(lines) {
  const items = []
  for (const line of lines) {
    const trimmed = line.replace(/^[*\-\s]+/, '').trim()
    if (!trimmed) continue
    const kvMatch = trimmed.match(/^([^:]+):\s*(.+)$/)
    if (kvMatch) {
      const cleanKey = stripAsterisks(kvMatch[1])
      const cleanVal = stripAsterisks(kvMatch[2])
      items.push({ type: 'kv', key: cleanKey, value: cleanVal })
    } else {
      const cleanVal = stripAsterisks(trimmed)
      items.push({ type: 'bullet', value: cleanVal })
    }
  }
  return items
}

// Structured section parser
function parseStructuredSections(text) {
  if (!text || typeof text !== 'string') return null

  // Clean initial asterisks around headers
  const knownHeaders = [
    'Case Details',
    'Incident Details',
    'Accused',
    'Victim',
    'Complainant',
    'Officer in Charge',
    'Network Links and Pattern Insights',
    'Timeline',
    'Conclusion'
  ]

  const hasStructuredHeader = knownHeaders.some((h) =>
    new RegExp(`(?:\\*\\*)?${h}:?(?:\\*\\*)?`, 'i').test(text)
  )

  if (!hasStructuredHeader) return null

  // Split into sections
  const sections = []
  const splitRegex = new RegExp(
    `(?:^|\\n)(?:\\*\\*)?(?:#+\\s*)?(${knownHeaders.join('|')}):?(?:\\*\\*)?`,
    'gi'
  )

  let match
  const matches = []

  while ((match = splitRegex.exec(text)) !== null) {
    matches.push({ title: stripAsterisks(match[1]), index: match.index, matchLength: match[0].length })
  }

  if (matches.length === 0) return null

  // Lead content before first header if any
  if (matches[0].index > 0) {
    const lead = stripAsterisks(text.slice(0, matches[0].index).trim())
    if (lead) {
      sections.push({ title: 'Overview', body: lead })
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const next = matches[i + 1]
    const bodyStart = current.index + current.matchLength
    const bodyEnd = next ? next.index : text.length
    const body = text.slice(bodyStart, bodyEnd).trim()
    sections.push({ title: stripAsterisks(current.title), body })
  }

  return sections
}

// Icon mapper for titles
function getSectionIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('case')) return <FileText size={14} style={{ color: 'var(--cyan)' }} />
  if (t.includes('incident')) return <AlertTriangle size={14} style={{ color: 'var(--amber)' }} />
  if (t.includes('accused')) return <UserX size={14} style={{ color: 'var(--red)' }} />
  if (t.includes('victim')) return <UserCheck size={14} style={{ color: 'var(--green)' }} />
  if (t.includes('complainant')) return <User size={14} style={{ color: 'var(--purple, #A855F7)' }} />
  if (t.includes('officer')) return <BadgeCheck size={14} style={{ color: 'var(--cyan)' }} />
  if (t.includes('network') || t.includes('pattern')) return <GitBranch size={14} style={{ color: '#00C8F0' }} />
  if (t.includes('timeline')) return <Clock size={14} style={{ color: 'var(--amber)' }} />
  if (t.includes('conclusion')) return <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />
  return <Shield size={14} style={{ color: 'var(--cyan)' }} />
}

export default function FormattedAIResponse({ content }) {
  const cleaned = cleanText(content)
  if (!cleaned) return null

  // Attempt to parse structured report sections
  const sections = parseStructuredSections(cleaned)

  if (sections && sections.length > 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {sections.map((sec, idx) => {
          const title = stripAsterisks(sec.title)
          const bodyLines = sec.body.split('\n').filter(Boolean)

          // Separate paragraphs and bullet lines
          const bulletLines = bodyLines.filter((l) => /^[*\-\s]+/.test(l.trim()))
          const paragraphLines = bodyLines.filter((l) => !/^[*\-\s]+/.test(l.trim()))
          const bullets = parseBullets(bulletLines)

          return (
            <div
              key={idx}
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-dim)',
                borderRadius: 6,
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              {/* Section Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-dim)', paddingBottom: 6 }}>
                {getSectionIcon(title)}
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)'
                  }}
                >
                  {title}
                </span>
              </div>

              {/* Paragraph content */}
              {paragraphLines.length > 0 && (
                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {paragraphLines.map((p, pIdx) => (
                    <p key={pIdx} style={{ marginBottom: pIdx === paragraphLines.length - 1 ? 0 : 6 }}>
                      {formatInlineMarkdown(p)}
                    </p>
                  ))}
                </div>
              )}

              {/* Key-Value grid / Bullet items */}
              {bullets.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
                  {/* Render KV items in a clean grid if present */}
                  {bullets.some((b) => b.type === 'kv') && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 6
                      }}
                    >
                      {bullets
                        .filter((b) => b.type === 'kv')
                        .map((kv, kvIdx) => {
                          const cleanK = stripAsterisks(kv.key)
                          const cleanV = stripAsterisks(kv.value)
                          const isStatus = cleanK.toLowerCase() === 'status'
                          const isFir = cleanK.toLowerCase().includes('fir')
                          return (
                            <div
                              key={kvIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '6px 10px',
                                background: 'var(--bg-row)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 4,
                                gap: 8
                              }}
                            >
                              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
                                {cleanK}
                              </span>
                              {isStatus ? (
                                <span
                                  className={
                                    cleanV.toLowerCase() === 'pending'
                                      ? 'tag-amber'
                                      : cleanV.toLowerCase() === 'solved' || cleanV.toLowerCase() === 'closed'
                                      ? 'tag-green'
                                      : 'tag-dim'
                                  }
                                  style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3 }}
                                >
                                  {cleanV}
                                </span>
                              ) : isFir ? (
                                <span className="tag-cyan" style={{ fontSize: 10, padding: '2px 8px', fontFamily: 'var(--mono)' }}>
                                  {cleanV}
                                </span>
                              ) : (
                                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>
                                  {formatInlineMarkdown(cleanV)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Render list items / suspect tags */}
                  {bullets
                    .filter((b) => b.type === 'bullet')
                    .map((b, bIdx) => {
                      const cleanV = stripAsterisks(b.value)
                      // Check if it's a list of linked individuals
                      const isSuspectList = title.toLowerCase().includes('network') || title.toLowerCase().includes('accused')
                      if (isSuspectList && cleanV.includes(',')) {
                        const names = cleanV.split(',').map((n) => stripAsterisks(n)).filter(Boolean)
                        return (
                          <div key={bIdx} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                            {names.map((name, nIdx) => (
                              <span
                                key={nIdx}
                                className="tag-purple"
                                style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}
                              >
                                <UserX size={10} /> {name}
                              </span>
                            ))}
                          </div>
                        )
                      }

                      return (
                        <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                          <ChevronRight size={12} style={{ color: 'var(--cyan)', marginTop: 3, flexShrink: 0 }} />
                          <div>{formatInlineMarkdown(cleanV)}</div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Fallback for standard response text or generic markdown
  const lines = cleaned.split('\n')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontSize: 13, lineHeight: 1.6 }}>
      {lines.map((line, idx) => {
        const trimmed = stripAsterisks(line.trim())
        if (!trimmed) return <div key={idx} style={{ height: 4 }} />

        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginLeft: 4 }}>
              <span style={{ color: 'var(--cyan)', fontSize: 14, lineHeight: 1 }}>•</span>
              <div>{formatInlineMarkdown(trimmed)}</div>
            </div>
          )
        }

        if (line.trim().startsWith('### ') || line.trim().startsWith('## ')) {
          return (
            <h4
              key={idx}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--cyan)',
                marginTop: 6,
                marginBottom: 2,
                letterSpacing: '0.04em'
              }}
            >
              {trimmed.replace(/^#+\s*/, '')}
            </h4>
          )
        }

        return <div key={idx}>{formatInlineMarkdown(trimmed)}</div>
      })}
    </div>
  )
}
