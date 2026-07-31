/**
 * Sanitizes and strips raw HTTP status lines and HTTP response headers
 * from LLM text responses or response data objects before rendering in the UI.
 *
 * @param {string} raw - Raw text string from backend or LLM
 * @returns {string} Clean, header-free text
 */
export function cleanText(raw) {
  if (!raw || typeof raw !== 'string') return typeof raw === 'string' ? raw : ''

  let text = raw

  // Attempt to parse stringified JSON if input starts with { or [
  if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
    try {
      const parsed = JSON.parse(text.trim())
      if (parsed && typeof parsed === 'object') {
        const unwrapped =
          parsed.data?.answer ||
          parsed.data?.text ||
          parsed.data?.content ||
          parsed.data?.executive_summary ||
          parsed.data ||
          parsed.answer ||
          parsed.text ||
          parsed.content ||
          parsed.output ||
          parsed.result ||
          parsed.message

        if (typeof unwrapped === 'string') {
          text = unwrapped
        }
      }
    } catch {
      // Not valid JSON, treat as raw text
    }
  }

  return text
    // Strip HTTP status lines (e.g. HTTP/1.1 200 OK, HTTP/2 200, HTTP/1.0 200 OK)
    .replace(/^HTTP\/\d(?:\.\d)?\s+\d+\s+.*?(?:\r?\n|$)/gim, '')
    // Strip HTTP header blocks at the start of text until empty line
    .replace(/^(?:content-type|content-length|server|date|connection|cache-control|pragma|expires|transfer-encoding|access-control-[a-z-]+|x-[a-z-]+|strict-transport-security|keep-alive|etag|location|vary):\s*.*?(?:\r?\n|$)/gim, '')
    // Strip any lingering raw HTTP headers formatted as Header: Value
    .replace(/^(content-type|content-length|server|date|connection|cache-control|pragma|expires|transfer-encoding|access-control-allow-[a-z-]+|x-powered-by|x-request-id):\s*.*$/gim, '')
    // Clean up leading newlines and surrounding whitespace
    .replace(/^\s*[\r\n]+/, '')
    .trim()
}

/**
 * Sanitizes and unwraps raw input (string, object, or Axios response)
 * stripping out HTTP protocol headers and returning clean UI content.
 *
 * @param {string|object} input - Input payload from AI API
 * @returns {string|object} Clean string or clean response object with sanitized text fields
 */
export function sanitizeAIResponse(input) {
  if (!input) return ''

  // Handle object input (JSON response or Axios response wrapper)
  if (typeof input === 'object' && input !== null) {
    // 1. Unwrap Axios response object if accidentally passed
    if (input.data !== undefined && (input.status !== undefined || input.headers !== undefined)) {
      return sanitizeAIResponse(input.data)
    }

    // 2. If object is a structured investigation/brief object, sanitize individual text fields
    if (input.executive_summary || input.answer || input.text || input.content || input.output || input.result) {
      const copy = { ...input }
      if (typeof copy.executive_summary === 'string') {
        copy.executive_summary = cleanText(copy.executive_summary)
      }
      if (typeof copy.answer === 'string') {
        copy.answer = cleanText(copy.answer)
      }
      if (typeof copy.text === 'string') {
        copy.text = cleanText(copy.text)
      }
      if (typeof copy.content === 'string') {
        copy.content = cleanText(copy.content)
      }
      if (typeof copy.output === 'string') {
        copy.output = cleanText(copy.output)
      }
      if (typeof copy.result === 'string') {
        copy.result = cleanText(copy.result)
      }
      return copy
    }

    // 3. Fallback: extract primary text field or stringify
    const extractedText =
      input.answer ||
      input.text ||
      input.content ||
      input.output ||
      input.result ||
      input.summary ||
      JSON.stringify(input)

    return cleanText(extractedText)
  }

  // Handle string input
  return cleanText(input)
}

export default sanitizeAIResponse
