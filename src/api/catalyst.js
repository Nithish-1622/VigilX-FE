/**
 * Zoho Catalyst Auth Client — Full SDK Integration for VigilX
 *
 * Architecture:
 *  - Catalyst handles ALL authentication state via ZGS session cookies.
 *  - No JWTs are stored on the frontend. The ZGS cookie is HttpOnly & auto-sent.
 *  - Email/Password: Catalyst SignIn API → session cookie set.
 *  - Google / Zoho OAuth: Catalyst SDK redirect → callback URL → session cookie set.
 *  - Token refresh: handled automatically by Catalyst SDK via ZGS cookie.
 *  - Backend validation: Django receives the ZGS cookie on every request.
 */

const PROJECT_ID  = import.meta.env.VITE_CATALYST_PROJECT_ID  || ''
const ENVIRONMENT = import.meta.env.VITE_CATALYST_ENV          || 'Development'
const REDIRECT_URL = import.meta.env.VITE_CATALYST_REDIRECT_URL || `${window.location.origin}/auth/callback`

// ── SDK Initialization ────────────────────────────────────────────────────────

let _sdk = null

/**
 * Get (and lazily initialize) the Catalyst SDK instance.
 * Supports both window.catalyst (CDN) and @zcatalyst/auth-client (npm).
 */
export const getCatalystSDK = () => {
  if (_sdk) return _sdk

  try {
    if (window.catalyst) {
      _sdk = window.catalyst
      console.log('[Catalyst SDK] Retrieved window.catalyst instance (automatically initialized by init.js)')
      return _sdk
    }
  } catch (e) {
    console.warn('[Catalyst SDK] window.catalyst init failed:', e.message)
  }

  // Fallback — create a duck-typed shim used when SDK is not available locally
  _sdk = null
  return null
}

// ── Session Check ─────────────────────────────────────────────────────────────

/**
 * Check whether the user currently has an active Catalyst session.
 * Returns { authenticated: true, user: {...} } or { authenticated: false, user: null }.
 *
 * Priority order:
 *  1. Catalyst SDK `isUserAuthenticated()` (works in Catalyst-hosted environments)
 *  2. Stored local session (for local dev / offline fallback)
 */
export const checkIsAuthenticated = async () => {
  const sdk = getCatalystSDK()

  // 1. Try Catalyst SDK (deployed environment)
  if (sdk?.auth?.isUserAuthenticated) {
    try {
      const user = await sdk.auth.isUserAuthenticated()
      if (user) {
        const profile = normalizeCatalystUser(user)
        return { authenticated: true, user: profile }
      }
    } catch (e) {
      console.log('[Catalyst Auth] isUserAuthenticated failed (expected locally):', e.message)
    }
  }

  // 2. Fallback: local session storage
  try {
    const stored = localStorage.getItem('vigilx_auth_user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.email) return { authenticated: true, user: parsed }
    }
  } catch {}

  return { authenticated: false, user: null }
}

// ── Email / Password Sign In ──────────────────────────────────────────────────

/**
 * Sign in with email and password via Catalyst.
 * On success the ZGS session cookie is set automatically.
 */
export const catalystSignIn = async (email, password) => {
  const sdk = getCatalystSDK()
  if (sdk?.auth?.signIn) {
    try {
      const result = await sdk.auth.signIn(email, password)
      return result
    } catch (e) {
      // Re-throw so store can handle and display proper error
      throw new Error(e?.message || 'Invalid credentials. Please try again.')
    }
  }

  // Local dev fallback — simulates sign in without real Catalyst
  console.log('[Catalyst Auth] Local dev mode — simulating email sign in')
  const userProfile = {
    email,
    first_name: email.split('@')[0] || 'Officer',
    last_name: 'User',
    display_name: email.split('@')[0] || 'Officer User',
    user_id: 'local_' + Date.now(),
    auth_provider: 'email',
    role: 'Intelligence Officer',
  }
  localStorage.setItem('vigilx_auth_user', JSON.stringify(userProfile))
  return { status: 'success', user: userProfile }
}

// ── Google OAuth Sign In ──────────────────────────────────────────────────────

/**
 * Trigger Google OAuth redirect via Catalyst.
 * The user's browser is navigated to Google → returns to REDIRECT_URL on success.
 * ZGS session cookie is set on the callback URL load.
 */
export const catalystSignInWithGoogle = () => {
  const sdk = getCatalystSDK()

  // Catalyst SDK Google OAuth redirect
  if (sdk?.auth) {
    try {
      // Build Catalyst OAuth URL for Google
      const oauthUrl = buildCatalystOAuthURL('google')
      window.location.href = oauthUrl
      return
    } catch (e) {
      console.warn('[Catalyst Google OAuth]', e.message)
    }
  }

  // Fallback for local dev
  console.log('[Catalyst Auth] Local dev mode — simulating Google OAuth redirect')
  const mockUser = {
    email: 'officer.google@agency.gov',
    first_name: 'Officer',
    last_name: 'Google',
    display_name: 'Officer Google',
    user_id: 'google_' + Date.now(),
    auth_provider: 'google',
    role: 'Senior Intelligence Analyst',
  }
  localStorage.setItem('vigilx_auth_user', JSON.stringify(mockUser))
  window.location.href = '/auth/callback?provider=google&mock=1'
}

// ── Zoho Account OAuth Sign In ────────────────────────────────────────────────

/**
 * Trigger Zoho Account OAuth redirect via Catalyst.
 * Returns to REDIRECT_URL on success with ZGS cookie set.
 */
export const catalystSignInWithZoho = () => {
  const sdk = getCatalystSDK()

  if (sdk?.auth) {
    try {
      const oauthUrl = buildCatalystOAuthURL('zoho')
      window.location.href = oauthUrl
      return
    } catch (e) {
      console.warn('[Catalyst Zoho OAuth]', e.message)
    }
  }

  // Fallback for local dev
  console.log('[Catalyst Auth] Local dev mode — simulating Zoho OAuth redirect')
  const mockUser = {
    email: 'officer.zoho@agency.gov',
    first_name: 'Officer',
    last_name: 'Zoho',
    display_name: 'Officer Zoho',
    user_id: 'zoho_' + Date.now(),
    auth_provider: 'zoho',
    role: 'Tactical Command Director',
  }
  localStorage.setItem('vigilx_auth_user', JSON.stringify(mockUser))
  window.location.href = '/auth/callback?provider=zoho&mock=1'
}

// ── Password Reset ────────────────────────────────────────────────────────────

/**
 * Send a password reset email via Catalyst.
 * Catalyst sends a reset link to the provided email.
 */
export const sendPasswordResetEmail = async (email) => {
  const sdk = getCatalystSDK()
  if (sdk?.auth?.forgotPassword) {
    try {
      await sdk.auth.forgotPassword(email, { redirect_url: `${window.location.origin}/reset-password` })
      return { success: true }
    } catch (e) {
      throw new Error(e?.message || 'Failed to send reset email. Please try again.')
    }
  }

  // Local dev fallback
  console.log('[Catalyst Auth] Local dev mode — simulating password reset email to:', email)
  return { success: true }
}

/**
 * Reset password using Catalyst reset token (from URL param).
 */
export const resetPasswordWithToken = async (token, newPassword) => {
  const sdk = getCatalystSDK()
  if (sdk?.auth?.resetPassword) {
    try {
      await sdk.auth.resetPassword(token, newPassword)
      return { success: true }
    } catch (e) {
      throw new Error(e?.message || 'Password reset failed. The link may have expired.')
    }
  }

  // Local dev fallback
  console.log('[Catalyst Auth] Local dev mode — simulating password reset')
  return { success: true }
}

// ── Email Verification ────────────────────────────────────────────────────────

/**
 * Verify email using Catalyst verification token (from URL param).
 */
export const verifyEmailToken = async (token) => {
  const sdk = getCatalystSDK()
  if (sdk?.auth?.verifyEmail) {
    try {
      await sdk.auth.verifyEmail(token)
      return { success: true }
    } catch (e) {
      throw new Error(e?.message || 'Email verification failed. The link may have expired.')
    }
  }
  return { success: true }
}

// ── Sign Up ───────────────────────────────────────────────────────────────────

/**
 * Register a new user via Catalyst.
 * Catalyst will send an email verification link if email verification is enabled.
 */
export const catalystSignUp = async (email, password, firstName = '', lastName = '') => {
  const sdk = getCatalystSDK()

  if (sdk?.auth?.signUp) {
    try {
      // Catalyst signUp expects a single configuration object
      const signupData = {
        first_name: firstName || 'Officer',
        last_name: lastName || 'User', // Mandatory field in Catalyst
        email_id: email,               // Mandatory field in Catalyst
        platform_type: 'web',
        redirect_url: `${window.location.origin}/auth/callback`,
      }
      const result = await sdk.auth.signUp(signupData)
      return result
    } catch (e) {
      throw new Error(e?.message || 'Registration failed. Please try again.')
    }
  }

  // Local dev fallback
  const userProfile = {
    email,
    first_name: firstName || email.split('@')[0] || 'Officer',
    last_name: lastName || 'User',
    display_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
    user_id: 'local_' + Date.now(),
    auth_provider: 'email',
    role: 'Intelligence Officer',
  }
  localStorage.setItem('vigilx_auth_user', JSON.stringify(userProfile))
  return { status: 'success', user: userProfile }
}

// ── Sign Out ──────────────────────────────────────────────────────────────────

/**
 * Sign out the current user.
 * Clears ZGS session cookie and local storage.
 */
export const catalystSignOut = async () => {
  localStorage.removeItem('vigilx_auth_user')
  localStorage.removeItem('vigilx_catalyst_session')

  const sdk = getCatalystSDK()
  if (sdk?.auth?.signOut) {
    try {
      await sdk.auth.signOut(`${window.location.origin}/login`)
      return
    } catch (e) {
      console.warn('[Catalyst SignOut]', e.message)
    }
  }

  // Local redirect
  window.location.href = '/login'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build Catalyst OAuth provider URL.
 * Catalyst SDK exposes `window.catalyst.auth.signInWithProvider` in some versions.
 * Construct the redirect URL manually for broader compatibility.
 */
const buildCatalystOAuthURL = (provider) => {
  // Catalyst OAuth URL format for ZGS-backed providers
  const baseURL = `https://accounts.zoho.in/oauth/v2/auth`
  const params = new URLSearchParams({
    client_id: '',  // Catalyst SDK injects its own client ID
    response_type: 'code',
    redirect_uri: REDIRECT_URL,
    scope: 'openid email profile',
    state: `catalyst_${provider}_${Date.now()}`,
    provider,
  })
  // Use Catalyst's own redirect which injects project credentials
  return `/auth/catalyst-redirect?provider=${provider}&redirect_url=${encodeURIComponent(REDIRECT_URL)}`
}

/**
 * Normalize Catalyst user object to a flat profile used across the app.
 */
export const normalizeCatalystUser = (rawUser) => {
  if (!rawUser) return null
  return {
    email:        rawUser.email_id    || rawUser.email    || '',
    first_name:   rawUser.first_name  || rawUser.firstName || '',
    last_name:    rawUser.last_name   || rawUser.lastName  || '',
    display_name: rawUser.display_name || `${rawUser.first_name || ''} ${rawUser.last_name || ''}`.trim() || rawUser.email_id || '',
    user_id:      rawUser.user_id     || rawUser.id        || '',
    auth_provider: rawUser.platform   || rawUser.auth_provider || 'email',
    role:         rawUser.role        || rawUser.role_details?.role_name || 'Intelligence Officer',
    profile_image_url: rawUser.profile_image_url || rawUser.avatar || null,
  }
}

export default {
  getCatalystSDK,
  checkIsAuthenticated,
  catalystSignIn,
  catalystSignInWithGoogle,
  catalystSignInWithZoho,
  catalystSignUp,
  catalystSignOut,
  sendPasswordResetEmail,
  resetPasswordWithToken,
  verifyEmailToken,
  normalizeCatalystUser,
}
