/* Registry of the ten challenges — drives the Demo Guide overlay and the small
   "Challenge NN" tags shown on the screens that demonstrate each one. */

import { HERO_RETURN_ID } from './hero'

export type Depth = 'flagship' | 'medium' | 'light'

export interface ChallengeDef {
  id: string // "01".."10"
  title: string
  oneLiner: string
  depth: Depth
  /** where to go to see it */
  route: string
  /** what to click / look for once there */
  demoNote: string
}

const R = HERO_RETURN_ID

export const CHALLENGES: ChallengeDef[] = [
  {
    id: '01',
    title: 'Source Document Traceability',
    oneLiner: 'Trace every number back to its source document + region.',
    depth: 'flagship',
    route: `/returns/${R}/review`,
    demoNote:
      'Click the Wages field → its two W-2 Box 1 regions highlight on the right. Click a document region → the fields it feeds highlight on the left. Open Capital gain: its sources span TWO pages of the Fidelity statement, and the viewer jumps to the exact page.',
  },
  {
    id: '02',
    title: 'Client & CPA Collaboration',
    oneLiner: 'Threaded, contextual comms with internal vs client-visible.',
    depth: 'light',
    route: `/returns/${R}/threads/TH-CAPGAIN`,
    demoNote:
      'Note the unmistakable internal-note vs client-visible styling, and the "who owns the next action" banner. Post a reply as either type. Threads attach to a field, a document (see the Contoso W-2 thread), or the whole return.',
  },
  {
    id: '03',
    title: 'Where to Start',
    oneLiner: 'A new client knows their next action within 10 seconds.',
    depth: 'medium',
    route: '/home',
    demoNote:
      'Switch to the Sarah Chen (client) persona first. One primary task dominates; nav is progressively revealed. Toggle the "after onboarding" state.',
  },
  {
    id: '04',
    title: 'Navigation Without Getting Lost',
    oneLiner: 'Move across objects without losing your place.',
    depth: 'medium',
    route: `/returns/${R}`,
    demoNote:
      'Every entity has a Related Objects panel and breadcrumbs. The top bar keeps a "recently viewed" trail. All routes are deep-linkable.',
  },
  {
    id: '05',
    title: 'Role-Aware Experiences',
    oneLiner: 'One shell, multiple roles, a persona switcher.',
    depth: 'medium',
    route: '/admin',
    demoNote:
      'Six roles, one shell. This page shows the role/permission matrix the shell actually enforces. Use the top-bar persona switcher: Sarah (individual), Daniel (business owner), Marcus (preparer), Diane (manager), Elena (admin), and Priya — firm staff who ALSO has a personal return and can flip between Staff mode and My taxes.',
  },
  {
    id: '06',
    title: 'Return Status & Progress',
    oneLiner: 'One status model rendered for clients vs staff.',
    depth: 'medium',
    route: `/returns/${R}/status`,
    demoNote:
      'Same underlying stage model, two renderings. Toggle Client view (plain language) vs Staff view (operational detail). Both show owner + blocker.',
  },
  {
    id: '07',
    title: 'Actionable Dashboard',
    oneLiner: '"What should I work on right now?" over 500+ returns.',
    depth: 'flagship',
    route: '/dashboard',
    demoNote:
      '523 returns in the book; Marcus alone owns ~200. The "Do this next" queue is ranked by real logic — hover a row to see WHY it ranks. Switch Manager lens (team workload) vs Preparer lens (my queue).',
  },
  {
    id: '08',
    title: 'Clickable vs. Editable',
    oneLiner: 'A consistent affordance system across all screens.',
    depth: 'flagship',
    route: '/design',
    demoNote:
      'The legend defines five value-states. See them live on the Review screen, the Questionnaire (items view), and here. Hover any value for its "why".',
  },
  {
    id: '09',
    title: 'Complexity Made Navigable',
    oneLiner: 'One return, hundreds of items, still navigable.',
    depth: 'medium',
    route: `/returns/${R}/items`,
    demoNote:
      'Search, filter by kind/section/state, group, and drill from summary to source detail — over 200 seeded items on this one return.',
  },
  {
    id: '10',
    title: 'Trustworthy AI',
    oneLiner: 'What/why/evidence/confidence + accept·edit·reject.',
    depth: 'flagship',
    route: `/returns/${R}/review/FLD-CAPGAIN`,
    demoNote:
      'Open the Capital gain field — the AI value here is deliberately WRONG. See the trust panel (what/why/evidence/confidence) and use Accept · Edit · Reject. Watch the dashboard flag clear.',
  },
]

export const CHALLENGE_BY_ID: Record<string, ChallengeDef> = Object.fromEntries(
  CHALLENGES.map((c) => [c.id, c]),
)
