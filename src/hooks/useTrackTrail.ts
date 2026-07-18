import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavTrail } from '../state/NavTrail'

/** Record the current screen in the "recently viewed" trail (Challenge 04). */
export function useTrackTrail(label: string, kind: string) {
  const { push } = useNavTrail()
  const loc = useLocation()
  useEffect(() => {
    if (label) push({ path: loc.pathname + loc.search, label, kind })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname, label])
}
