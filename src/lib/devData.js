const caseData = [
  {
    id: 1,
    fir_number: 'FIR-123',
    crime_type: 'THEFT',
    incident_date_time: '2026-07-14T09:20:00.000Z',
    reported_date_time: '2026-07-14T10:05:00.000Z',
    location: 'Koramangala, Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    status: 'PENDING',
    description: 'Wallet and mobile phone reported missing from a parked vehicle.',
  },
  {
    id: 2,
    fir_number: 'FIR-124',
    crime_type: 'ASSAULT',
    incident_date_time: '2026-07-13T18:45:00.000Z',
    reported_date_time: '2026-07-13T19:10:00.000Z',
    location: 'Indiranagar, Bengaluru',
    latitude: 12.9716,
    longitude: 77.6412,
    status: 'INVESTIGATING',
    description: 'Altercation outside a retail outlet with identified witnesses.',
  },
  {
    id: 3,
    fir_number: 'FIR-125',
    crime_type: 'BURGLARY',
    incident_date_time: '2026-07-11T02:15:00.000Z',
    reported_date_time: '2026-07-11T06:30:00.000Z',
    location: 'Whitefield, Bengaluru',
    latitude: 12.9698,
    longitude: 77.75,
    status: 'SOLVED',
    description: 'Residential break-in with recovered electronic devices.',
  },
]

const accusedData = [
  {
    id: 1,
    fir: 'FIR-123',
    name: 'John Doe',
    alias: 'JD',
    status: 'UNDER WATCH',
    relation: 'Primary suspect',
  },
  {
    id: 2,
    fir: 'FIR-125',
    name: 'Rahul Verma',
    alias: 'RV',
    status: 'ARRESTED',
    relation: 'Known associate',
  },
]

const victimData = [
  {
    id: 1,
    fir: 'FIR-123',
    name: 'Anita Sharma',
    injury_status: 'UNHARMED',
    contact: '+91-90000-11111',
  },
  {
    id: 2,
    fir: 'FIR-124',
    name: 'Imran Khan',
    injury_status: 'MINOR INJURY',
    contact: '+91-90000-22222',
  },
]

export const getMockCases = (searchQuery = '') => {
  if (!searchQuery) return caseData

  const query = searchQuery.toLowerCase()
  return caseData.filter((entry) =>
    [entry.fir_number, entry.crime_type, entry.location, entry.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query))
  )
}

export const addMockCase = (newCaseData) => {
  const createdCase = {
    id: Date.now(),
    ...newCaseData,
  }

  caseData.unshift(createdCase)
  return createdCase
}

export const getMockAccused = (firId = '') => {
  if (!firId) return accusedData
  return accusedData.filter((entry) => entry.fir === firId)
}

export const addMockAccused = (accusedDataItem) => {
  const createdAccused = {
    id: Date.now(),
    ...accusedDataItem,
  }

  accusedData.unshift(createdAccused)
  return createdAccused
}

export const getMockVictims = (firId = '') => {
  if (!firId) return victimData
  return victimData.filter((entry) => entry.fir === firId)
}

export const addMockVictim = (victimDataItem) => {
  const createdVictim = {
    id: Date.now(),
    ...victimDataItem,
  }

  victimData.unshift(createdVictim)
  return createdVictim
}

export const buildMockAiResponse = ({ question, sessionId, userId }) => ({
  session_id: sessionId,
  user_id: userId,
  answer: `Dev-mode response for "${question}". Protected AI calls are bypassed locally.`,
  confidence: 'HIGH',
  citations: [],
})
