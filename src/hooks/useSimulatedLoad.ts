import { useEffect, useState } from 'react'

/* Simulates network latency so loading states are real. Data itself lives in
   the in-memory store; this hook just gates the reveal so skeletons show. The
   delay is honestly fake — see the README's "what's real vs simulated". */
export function useSimulatedLoad(ms = 450, deps: unknown[] = []): boolean {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return loading
}
