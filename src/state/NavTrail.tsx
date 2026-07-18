/* ============================================================================
   NAV TRAIL — Challenge 04 "Navigation without getting lost"
   Records the last few meaningful places the user has been (with a label and
   the object kind) so the shell can offer a real "back to where I was" trail,
   not just the browser's blind back button. Persisted per-session.
   ========================================================================== */

import { createContext, useContext, useState, type ReactNode } from 'react'

export interface TrailEntry {
  path: string
  label: string
  kind: string
}

interface TrailValue {
  trail: TrailEntry[]
  push: (e: TrailEntry) => void
}

const Ctx = createContext<TrailValue | null>(null)

export function NavTrailProvider({ children }: { children: ReactNode }) {
  const [trail, setTrail] = useState<TrailEntry[]>([])

  const push = (e: TrailEntry) => {
    setTrail((prev) => {
      if (prev[prev.length - 1]?.path === e.path) return prev
      const next = [...prev.filter((x) => x.path !== e.path), e]
      return next.slice(-8)
    })
  }

  return <Ctx.Provider value={{ trail, push }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavTrail() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNavTrail must be used within NavTrailProvider')
  return ctx
}
