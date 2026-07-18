import type { Persona } from './types'

/* ============================================================================
   PERSONAS — Challenge 05 "Role-Aware Experiences"
   Four switchable identities covering the required spread: a client, a
   preparer, a manager (team lens), and the edge case — a firm employee who
   ALSO has a personal return in the system (Priya), who can flip between
   "staff mode" and "my own taxes".
   ========================================================================== */

export const PERSONAS: Persona[] = [
  {
    id: 'u-client',
    name: 'Sarah Chen',
    title: 'Client — Individual filer',
    roles: ['client'],
    primaryRole: 'client',
    initials: 'SC',
    color: '#0d9488',
    personalClientId: 'c-chen',
    blurb: 'A first-time-ish client filing a 1040 with two W-2s and a brokerage account.',
  },
  {
    id: 'u-preparer',
    name: 'Marcus Reed',
    title: 'Tax Preparer',
    roles: ['preparer'],
    primaryRole: 'preparer',
    initials: 'MR',
    color: '#2563eb',
    blurb: 'Owns a queue of ~30 returns. Lives on the dashboard and the review screen.',
  },
  {
    id: 'u-manager',
    name: 'Diane Okafor',
    title: 'Review Manager',
    roles: ['manager', 'reviewer'],
    primaryRole: 'manager',
    initials: 'DO',
    color: '#7c3aed',
    blurb: 'Sees the whole team’s workload and signs off on returns in review.',
  },
  {
    id: 'u-staff-personal',
    name: 'Priya Nair',
    title: 'Seasonal Preparer · also a client',
    roles: ['preparer', 'seasonal', 'client'],
    primaryRole: 'preparer',
    initials: 'PN',
    color: '#d97706',
    personalClientId: 'c-nair',
    blurb: 'Edge case: firm staff who also files her own return — switches between staff mode and her own taxes.',
  },
]

export const PERSONA_BY_ID: Record<string, Persona> = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p]),
)
