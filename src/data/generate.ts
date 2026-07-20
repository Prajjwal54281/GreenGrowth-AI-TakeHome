/* ============================================================================
   GENERATED VOLUME
   Two jobs:
   1. Fill the hero return with hundreds of lightweight items so Challenge 09
      (complexity made navigable) has real scale to search/filter/group.
   2. Generate 120 returns across a fake firm so Challenge 07 (dashboard) has a
      realistic book of business to prioritize.
   All deterministic via a seeded RNG.
   ========================================================================== */

import type {
  QuestionnaireItem,
  Warning,
  TaxReturn,
  Client,
  Stage,
  OwnerRole,
} from './types'
import type { AffordanceState } from '../design/affordances'
import { makeRng, pick, int, addDays, NOW } from './rng'
import { HERO_RETURN_ID } from './hero'

/* ---- Firm team (data-only preparers for the manager lens) ---------------- */
export interface TeamMember {
  id: string
  name: string
  initials: string
  seasonal: boolean
}
export const TEAM: TeamMember[] = [
  { id: 'u-preparer', name: 'Marcus Reed', initials: 'MR', seasonal: false },
  { id: 't-ortiz', name: 'Lena Ortiz', initials: 'LO', seasonal: false },
  { id: 't-becker', name: 'Tom Becker', initials: 'TB', seasonal: false },
  { id: 't-khan', name: 'Aisha Khan', initials: 'AK', seasonal: true },
  { id: 'u-staff-personal', name: 'Priya Nair', initials: 'PN', seasonal: true },
  { id: 't-silva', name: 'Rafael Silva', initials: 'RS', seasonal: false },
]
export const TEAM_BY_ID: Record<string, TeamMember> = Object.fromEntries(
  TEAM.map((t) => [t.id, t]),
)

/* ---- 09: hero questionnaire + warnings ----------------------------------- */
const Q_SECTIONS = [
  'Personal & Filing',
  'Dependents',
  'Income',
  'Investments',
  'Deductions',
  'Credits',
  'Foreign Accounts',
  'State',
  'Estimated Payments',
  'Bank & Refund',
]

const Q_TEMPLATES = [
  'Did you have any {x} during 2025?',
  'Please confirm your {x} for the year.',
  'Do any {x} apply to your situation?',
  'Provide details for {x} if applicable.',
  'Was there a change to your {x} this year?',
]
const Q_TOPICS = [
  'dependents',
  'charitable contributions',
  'mortgage interest',
  'student loan interest',
  'HSA contributions',
  'IRA contributions',
  'rental property',
  'self-employment income',
  'foreign bank accounts',
  'state estimated payments',
  'childcare expenses',
  'medical expenses',
  'energy-efficiency upgrades',
  'stock option exercises',
  'crypto transactions',
  'gambling winnings',
]

export function heroQuestionnaire(): QuestionnaireItem[] {
  const rng = makeRng(4242)
  const items: QuestionnaireItem[] = []
  // a few authored, meaningful ones first
  items.push(
    {
      id: 'Q-HERO-1',
      returnId: HERO_RETURN_ID,
      section: 'Personal & Filing',
      question: 'Confirm your filing status (Single) for 2025.',
      answer: 'Single',
      affordance: 'verified',
      required: true,
    },
    {
      id: 'Q-HERO-2',
      returnId: HERO_RETURN_ID,
      section: 'Investments',
      question: 'Did you sell any stocks or securities in 2025?',
      answer: 'Yes — Fidelity brokerage',
      affordance: 'verified',
      required: true,
    },
    {
      id: 'Q-HERO-3',
      returnId: HERO_RETURN_ID,
      section: 'Investments',
      question: 'Upload the 1099-B covering those sales.',
      answer: undefined,
      affordance: 'editable',
      required: true,
    },
    {
      id: 'Q-HERO-4',
      returnId: HERO_RETURN_ID,
      section: 'Foreign Accounts',
      question: 'Do you have signature authority over any foreign financial account?',
      answer: 'No',
      affordance: 'verified',
      required: true,
    },
  )
  // volume filler — enough that search/filter/group are genuinely necessary
  const affs: AffordanceState[] = ['ai-unverified', 'verified', 'editable', 'locked']
  for (let i = 0; i < 132; i++) {
    const topic = pick(rng, Q_TOPICS)
    const q = pick(rng, Q_TEMPLATES).replace('{x}', topic)
    const answered = rng() > 0.4
    items.push({
      id: `Q-${i + 100}`,
      returnId: HERO_RETURN_ID,
      section: pick(rng, Q_SECTIONS),
      question: q,
      answer: answered ? pick(rng, ['Yes', 'No', 'N/A', 'See attached', '$1,200', '$450']) : undefined,
      affordance: answered ? pick(rng, affs) : 'editable',
      required: rng() > 0.6,
    })
  }
  return items
}

export function heroWarnings(): Warning[] {
  const rng = makeRng(99)
  const out: Warning[] = [
    {
      id: 'WARN-CONFLICT',
      returnId: HERO_RETURN_ID,
      severity: 'critical',
      message:
        'Cost basis conflict on capital gains: Fidelity statement ($38,900) vs. client-reported 1099-B ($41,200).',
      relatedFieldId: 'FLD-CAPGAIN',
    },
    {
      id: 'WARN-AIERROR',
      returnId: HERO_RETURN_ID,
      severity: 'critical',
      message: 'AI capital-gain figure ($3,600) does not reconcile with proceeds − basis. Do not accept as-is.',
      relatedFieldId: 'FLD-CAPGAIN',
    },
    {
      id: 'WARN-LOWCONF',
      returnId: HERO_RETURN_ID,
      severity: 'warning',
      message: 'Interest income read from a low-quality scan (52% confidence). Confirm before filing.',
      relatedFieldId: 'FLD-INTEREST',
    },
    {
      id: 'WARN-2W2',
      returnId: HERO_RETURN_ID,
      severity: 'info',
      message: 'Two W-2s detected and merged into Line 1a wages.',
      relatedFieldId: 'FLD-WAGES',
    },
  ]
  const msgs = [
    'Prior-year carryover not yet confirmed for this section.',
    'Rounding difference under $1 detected between schedule and summary.',
    'State return will need this figure once federal is final.',
    'Document date is outside the tax year — verify it belongs to 2025.',
    'Possible duplicate entry — review before finalizing.',
    'Estimated payment not matched to an IRS confirmation number.',
  ]
  for (let i = 0; i < 86; i++) {
    out.push({
      id: `WARN-${i + 100}`,
      returnId: HERO_RETURN_ID,
      severity: pick(rng, ['info', 'info', 'warning'] as const),
      message: pick(rng, msgs),
    })
  }
  return out
}

/* ---- 07: the firm's book of business ------------------------------------- */
const FIRST = [
  'James', 'Maria', 'David', 'Linda', 'Robert', 'Patricia', 'John', 'Jennifer',
  'Michael', 'Elizabeth', 'William', 'Susan', 'Ahmed', 'Yuki', 'Sofia', 'Chen',
  'Omar', 'Fatima', 'Diego', 'Nina', 'Hassan', 'Grace', 'Leo', 'Maya',
]
const LAST = [
  'Anderson', 'Nguyen', 'Patel', 'Garcia', 'Kim', 'Johnson', 'Martinez', 'Lee',
  'Brown', 'Rossi', 'Cohen', 'Sato', 'Okonkwo', 'Fischer', 'Ivanov', 'Costa',
  'Haddad', 'Reyes', 'Novak', 'Berg',
]
const BIZ = [
  'Blue Harbor Design Co', 'Summit Logistics LLC', 'Northwind Traders',
  'Riverstone Dental PC', 'Apex Fitness Studio', 'Cedar & Co Bakery',
  'Lumen Software Inc', 'Ironwood Construction', 'Meridian Consulting LLC',
  'Coastal Property Group',
]

const STAGES_POOL: Stage[] = [
  'intake', 'documents', 'documents', 'preparation', 'preparation',
  'preparation', 'review', 'review', 'signoff', 'filed',
]
const FORMS: TaxReturn['formType'][] = ['1040', '1040', '1040', '1120S', '1065', '1120']

export interface GeneratedBook {
  clients: Client[]
  returns: TaxReturn[]
}

export function generateBook(): GeneratedBook {
  const rng = makeRng(20250718)
  const clients: Client[] = []
  const returns: TaxReturn[] = []
  const count = 122

  for (let i = 0; i < count; i++) {
    const isBiz = rng() > 0.72
    const clientId = `c-${i + 200}`
    const name = isBiz
      ? pick(rng, BIZ) + ` #${int(rng, 1, 40)}`
      : `${pick(rng, FIRST)} ${pick(rng, LAST)}`
    clients.push({
      id: clientId,
      name,
      entityType: isBiz ? 'business' : 'individual',
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      primaryContact: pick(rng, TEAM).name,
      since: int(rng, 2018, 2025),
    })

    const stage = pick(rng, STAGES_POOL)
    const preparer = pick(rng, TEAM)
    // due dates spread from 45 days ago to 100 days out
    const dueOffset = int(rng, -45, 100)
    const dueDate = addDays(NOW, dueOffset)
    const overdue = dueOffset < 0 && stage !== 'filed'

    const waitingStages: Stage[] = ['documents', 'signoff']
    const isWaiting = waitingStages.includes(stage) && rng() > 0.35
    const daysWaiting = isWaiting ? int(rng, 1, 34) : 0
    const blocked = isWaiting && daysWaiting > 10
    const lowConfidence = rng() > 0.78
    const conflict = rng() > 0.9
    const aiError = rng() > 0.93
    const openReviewFlags = stage === 'review' ? int(rng, 0, 4) : rng() > 0.85 ? int(rng, 1, 2) : 0

    let nextActionOwner: OwnerRole = 'preparer'
    let nextAction = 'Continue preparing the return'
    if (stage === 'intake') { nextActionOwner = 'client'; nextAction = 'Complete intake questionnaire' }
    else if (stage === 'documents') { nextActionOwner = 'client'; nextAction = 'Upload requested documents' }
    else if (stage === 'review') { nextActionOwner = 'reviewer'; nextAction = 'Complete reviewer sign-off' }
    else if (stage === 'signoff') { nextActionOwner = 'client'; nextAction = 'Approve the finished return' }
    else if (stage === 'filed') { nextActionOwner = 'firm'; nextAction = 'Filed — archive copy' }

    returns.push({
      id: `RET-${2000 + i}`,
      clientId,
      taxYear: 2025,
      formType: isBiz ? pick(rng, ['1120S', '1065', '1120'] as const) : '1040',
      stage,
      preparerId: preparer.id,
      reviewerId: 'u-manager',
      dueDate,
      progress:
        stage === 'filed' ? 1 :
        stage === 'signoff' ? 0.9 :
        stage === 'review' ? 0.8 :
        stage === 'preparation' ? int(rng, 30, 75) / 100 :
        stage === 'documents' ? int(rng, 10, 40) / 100 : 0.05,
      flags: { blocked, overdue, lowConfidence, conflict, aiError },
      blockingReason: blocked ? 'Waiting on outstanding client documents.' : undefined,
      nextActionOwner,
      nextAction,
      daysWaitingOnClient: daysWaiting,
      openReviewFlags,
      estimatedRefund: int(rng, -4000, 9000),
      complexityScore: int(rng, 1, 8),
    })
    void FORMS
  }
  return { clients, returns }
}
