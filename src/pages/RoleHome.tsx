import { Navigate } from 'react-router-dom'
import { useEffectiveRole } from '../state/AppState'

/** The index route sends each role to its natural landing screen (Challenge 05). */
export function RoleHome() {
  const role = useEffectiveRole()
  return <Navigate to={role === 'client' ? '/home' : '/dashboard'} replace />
}
