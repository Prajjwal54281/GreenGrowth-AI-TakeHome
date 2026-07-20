/* ============================================================================
   DOMAIN TYPES
   The typed shape of the whole (fake) product. Everything the UI renders is a
   projection of these. Kept in one file so the data model reads top-to-bottom.
   ========================================================================== */

import type { AffordanceState } from '../design/affordances'

/* ---- People & roles (Challenges 05) -------------------------------------- */
export type Role =
  | 'client'
  | 'preparer'
  | 'reviewer'
  | 'manager'
  | 'admin'
  | 'seasonal'

export interface Persona {
  id: string
  name: string
  title: string
  roles: Role[]
  /** the role the shell renders as by default */
  primaryRole: Role
  initials: string
  color: string
  /** 05 edge case: a firm employee who ALSO has a personal return in the system */
  personalClientId?: string
  /** a client persona filing for a business entity rather than as an individual */
  entityContext?: EntityType
  /** short blurb shown in the switcher */
  blurb: string
}

/* ---- Clients & returns --------------------------------------------------- */
export type EntityType = 'individual' | 'business'

export interface Client {
  id: string
  name: string
  entityType: EntityType
  email: string
  /** the human who owns the relationship */
  primaryContact: string
  since: number // tax year they joined
}

/** The single status model (Challenge 06). Rendered two ways. */
export type Stage =
  | 'intake'
  | 'documents'
  | 'preparation'
  | 'review'
  | 'signoff'
  | 'filed'

export interface StageDef {
  stage: Stage
  /** plain-language label a client sees */
  clientLabel: string
  /** operational label staff see */
  staffLabel: string
  order: number
}

export type OwnerRole = 'client' | 'preparer' | 'reviewer' | 'firm'

export interface ReturnFlags {
  blocked: boolean
  overdue: boolean
  lowConfidence: boolean
  conflict: boolean
  /** an AI suggestion on this return is actually wrong (correction flow demo) */
  aiError: boolean
}

export interface TaxReturn {
  id: string
  clientId: string
  taxYear: number
  formType: '1040' | '1120S' | '1065' | '1120'
  stage: Stage
  preparerId: string
  reviewerId: string
  /** ISO date */
  dueDate: string
  /** 0..1 completion of the current body of work */
  progress: number
  flags: ReturnFlags
  /** what is blocking completion right now, plain language */
  blockingReason?: string
  /** who owns the very next action */
  nextActionOwner: OwnerRole
  nextAction: string
  /** days the ball has been in the client's court (0 if not waiting) */
  daysWaitingOnClient: number
  /** number of open review flags a reviewer raised */
  openReviewFlags: number
  estimatedRefund: number
  complexityScore: number // 1..10, drives which return is the "big" one (09)
}

/* ---- Source documents & traceability (Challenge 01) ---------------------- */
export type DocType = 'W-2' | '1099-INT' | '1099-DIV' | 'brokerage'

/** A highlightable region on a document page. bbox is in % of the page so the
 *  overlay scales with the rendered mock. */
export interface DocRegion {
  id: string
  page: number
  /** percentages 0..100 */
  bbox: { x: number; y: number; w: number; h: number }
  /** the box label as printed on the form, e.g. "Box 1 — Wages" */
  label: string
  /** the raw value read from this region */
  rawValue: string
  /** return field ids this region feeds into */
  feedsFieldIds: string[]
}

export interface TaxDocument {
  id: string
  returnId: string
  type: DocType
  /** e.g. "W-2 — Initech LLC" */
  title: string
  issuer: string
  pageCount: number
  uploadedAt: string
  regions: DocRegion[]
}

/* ---- AI metadata on a field (Challenge 10) ------------------------------- */
export interface AIMeta {
  /** 0..1 */
  confidence: number
  /** what the AI did, one line */
  did: string
  /** why it produced this value */
  rationale: string
  /** the value the AI proposes */
  suggestedValue: string
  /** doc region ids that are the evidence */
  evidenceRegionIds: string[]
  /** true when the seeded suggestion is deliberately WRONG (reject-flow demo) */
  isWrong: boolean
  /** if conflicting sources exist, the competing value + where it came from */
  conflict?: { otherValue: string; otherSourceLabel: string }
}

/* ---- Return fields (Challenges 01 / 08 / 10) ----------------------------- */
export interface ReturnField {
  id: string
  returnId: string
  /** the 1040 (etc.) line reference */
  line: string
  label: string
  value: string
  affordance: AffordanceState
  /** regions that are the source of this value */
  sourceRegionIds: string[]
  /** human-readable calculation, e.g. "W-2 Initech Box 1 + W-2 Contoso Box 1" */
  calculation?: string
  /** the operands, for showing the sum visually */
  calcOperands?: { label: string; value: string }[]
  ai?: AIMeta
  section: string // grouping for the return (Income, Deductions, Credits...)
}

/* ---- Collaboration (Challenge 02) ---------------------------------------- */
export type Visibility = 'internal' | 'client-visible'

export interface Message {
  id: string
  authorId: string
  authorName: string
  authorRole: Role
  body: string
  visibility: Visibility
  createdAt: string
}

export interface Thread {
  id: string
  returnId: string
  subject: string
  /** what the thread is attached to */
  ref: { kind: 'document' | 'field' | 'return' | 'task'; id: string; label: string }
  status: 'open' | 'resolved'
  /** who owns the next action on this thread */
  nextOwner: OwnerRole
  messages: Message[]
}

/* ---- Tasks, requests, questionnaire, warnings (03/04/06/09) --------------- */
export interface OutstandingRequest {
  id: string
  returnId: string
  title: string
  detail: string
  /** action-appropriate button label on the client home ("Upload now" vs "Review & approve") */
  cta?: string
  owner: OwnerRole
  status: 'open' | 'done'
  dueDate: string
  createdAt: string
  daysWaiting: number
  /** links to a related object for navigation (04) */
  relatedThreadId?: string
  relatedDocId?: string
}

export interface QuestionnaireItem {
  id: string
  returnId: string
  section: string
  question: string
  answer?: string
  affordance: AffordanceState
  required: boolean
}

export interface Warning {
  id: string
  returnId: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  relatedFieldId?: string
}

/* ---- The whole seeded world ---------------------------------------------- */
export interface SeedWorld {
  personas: Persona[]
  clients: Client[]
  returns: TaxReturn[]
  documents: TaxDocument[]
  fields: ReturnField[]
  threads: Thread[]
  requests: OutstandingRequest[]
  questionnaire: QuestionnaireItem[]
  warnings: Warning[]
}
