/* Role-aware sidebar configuration (Challenge 05). The SAME shell renders a
   different nav set per effective role, so the product feels built-for-you
   without splitting into separate apps. */

import { ICONS } from '../components/ui/Icon'
import { HERO_RETURN_ID } from '../data/hero'
import type { Role, EntityType } from '../data/types'

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

/** Client nav is built per-return so a firm employee in "My taxes" mode links
 *  to THEIR return, not the demo client's (Challenge 05). Business-entity
 *  clients get entity-flavoured labels off the same structure. */
function clientNav(returnId: string, entity: EntityType = 'individual'): NavSection[] {
  const isBiz = entity === 'business'
  return [
    {
      items: [
        { label: 'Home', to: '/home', icon: ICONS.dashboard, challenge: '03' },
        {
          label: isBiz ? 'Business return' : 'My return',
          to: `/returns/${returnId}/status`,
          icon: ICONS.status,
          challenge: '06',
        },
        {
          label: isBiz ? 'Records & questions' : 'Documents & questions',
          to: `/returns/${returnId}/items`,
          icon: ICONS.items,
          challenge: '09',
        },
        { label: 'Messages', to: '/messages', icon: ICONS.messages, challenge: '02' },
      ],
    },
  ]
}

const ADMIN_NAV: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: ICONS.dashboard, challenge: '07' },
      { label: 'Returns', to: '/returns', icon: ICONS.returns, matchPrefix: '/returns' },
      { label: 'Messages', to: '/messages', icon: ICONS.messages, challenge: '02' },
    ],
  },
  {
    heading: 'Administration',
    items: [
      { label: 'Firm & roles', to: '/admin', icon: ICONS.person, challenge: '05' },
      { label: 'Affordances', to: '/design', icon: ICONS.review, challenge: '08' },
    ],
  },
]

export function navForRole(
  role: Role,
  clientReturnId: string = R,
  entity: EntityType = 'individual',
): NavSection[] {
  if (role === 'client') return clientNav(clientReturnId, entity)
  if (role === 'admin') return ADMIN_NAV
  return STAFF_NAV
}
