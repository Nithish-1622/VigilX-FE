const toBool = (value) => value === 'TRUE' || value === 'true'

export const isDevMode = toBool(import.meta.env.VITE_DEV_MODE) || toBool(import.meta.env.DEV_MODE)

export const DEV_USER = {
  username: 'officer1',
  badgeNumber: 'DEV-007',
  department: 'Crime Investigation Dept (CID)',
  role: 'Inspector',
}

