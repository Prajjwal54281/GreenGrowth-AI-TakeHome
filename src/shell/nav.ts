/* Role-aware sidebar configuration (Challenge 05). The SAME shell renders a
   different nav set per effective role, so the product feels built-for-you
   without splitting into separate apps. */

import { ICONS } from '../components/ui/Icon'
import { HERO_RETURN_ID } from '../data/hero'
import type { Role } from '../data/types'

export interface NavItem {
  label: string
  to: string
  icon: string
  /** challenge tag shown as a tiny superscript in the sidebar */
  challenge?: string
  /** match nested routes as active */
  matchPrefix?: string
}

export interface NavSection {
  heading?: string
  items: NavItem[]
}

const R = HERO_RETURN_ID

const STAFF_NAV: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: ICONS.dashboard, challenge: '07' },
      { label: 'Returns', to: '/returns', icon: ICONS.returns, matchPrefix: '/returns' },
      { label: 'Messages', to: '/messages', icon: ICONS.messages, challenge: '02' },
      { label: 'Tasks', to: '/tasks', icon: ICONS.tasks },
    ],
  },
  {
    heading: 'Design system',
    items: [
      { label: 'Affordances', to: '/design', icon: ICONS.review, challenge: '08' },
    ],
  },
]

const CLIENT_NAV: NavSection[] = [
  {
    items: [
      { label: 'Home', to: '/home', icon: ICONS.dashboard, challenge: '03' },
      { label: 'My return', to: `/returns/${R}/status`, icon: ICONS.status, challenge: '06' },
      { label: 'Documents & questions', to: `/returns/${R}/items`, icon: ICONS.items, challenge: '09' },
      { label: 'Messages', to: '/messages', icon: ICONS.messages, challenge: '02' },
    ],
  },
]

export function navForRole(role: Role): NavSection[] {
  if (role === 'client') return CLIENT_NAV
  return STAFF_NAV
}
