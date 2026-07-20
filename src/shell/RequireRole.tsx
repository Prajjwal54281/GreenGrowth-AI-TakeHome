import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useEffectiveRole } from '../state/AppState'

/* ============================================================================
   ROUTE GUARDS: Challenge 05
   Nav changing per role isn't enough: the ROUTES have to be gated too,
   otherwise a client context can still reach a firm-wide screen by URL (or by
   staying on it after a context switch). Staff-only screens bounce a client
   context back to their own home.

   This is presentation-layer gating only. There is no real auth behind it.
   See the README's "what's real vs simulated".
   ========================================================================== */

export function RequireStaff({ children }: { children: ReactNode }) {
  const role = useEffectiveRole()
  if (role === 'client') return <Navigate to="/home" replace />
  return <>{children}</>
}
