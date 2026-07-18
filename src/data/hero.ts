/* ============================================================================
   THE HERO RETURN — Sarah Chen, 1040, TY2025 (RET-1001)
   ----------------------------------------------------------------------------
   This is the hand-authored return that powers the flagship screens:
   01 traceability, 08 affordances, 10 trustworthy AI, and (with generated
   filler) 09 complexity. Every field links to real document regions, and the
   required edge cases live here:
     • low-confidence extraction  → interest income (blurry 1099-INT)
     • two docs conflict on one field → capital gains cost basis
     • an AI suggestion that is WRONG → capital gains value (transposed)
     • an overdue client request → the missing 1099-B
   ========================================================================== */

import type {
  Client,
  TaxReturn,
  TaxDocument,
  ReturnField,
  Thread,
  OutstandingRequest,
} from './types'
import { NOW, addDays } from './rng'

export const HERO_RETURN_ID = 'RET-1001'

/* ---- Clients (hero + the staff-personal edge case) ----------------------- */
export const HERO_CLIENTS: Client[] = [
  {
    id: 'c-chen',
    name: 'Sarah Chen',
    entityType: 'individual',
    email: 'sarah.chen@example.com',
    primaryContact: 'Marcus Reed',
    since: 2023,
  },
  {
    id: 'c-nair',
    name: 'Priya Nair',
    entityType: 'individual',
    email: 'priya.nair@greenfield-cpa.example',
    primaryContact: 'Diane Okafor',
    since: 2024,
  },
]

/* ---- Documents & traceability regions ------------------------------------ */
export const HERO_DOCUMENTS: TaxDocument[] = [
  {
    id: 'DOC-W2-INITECH',
    returnId: HERO_RETURN_ID,
    type: 'W-2',
    title: 'W-2 — Initech LLC',
    issuer: 'Initech LLC',
    pageCount: 1,
    uploadedAt: addDays(NOW, -41),
    regions: [
      {
        id: 'R-W2I-B1',
        page: 1,
        bbox: { x: 5, y: 30, w: 44, h: 11 },
        label: 'Box 1 — Wages, tips, other comp.',
        rawValue: '82,450.00',
        feedsFieldIds: ['FLD-WAGES'],
      },
      {
        id: 'R-W2I-B2',
        page: 1,
        bbox: { x: 51, y: 30, w: 44, h: 11 },
        label: 'Box 2 — Federal income tax withheld',
        rawValue: '12,300.00',
        feedsFieldIds: ['FLD-WITHHOLDING'],
      },
      {
        id: 'R-W2I-B16',
        page: 1,
        bbox: { x: 5, y: 72, w: 44, h: 11 },
        label: 'Box 16 — State wages',
        rawValue: '82,450.00',
        feedsFieldIds: [],
      },
    ],
  },
  {
    id: 'DOC-W2-CONTOSO',
    returnId: HERO_RETURN_ID,
    type: 'W-2',
    title: 'W-2 — Contoso Corp',
    issuer: 'Contoso Corp',
    pageCount: 1,
    uploadedAt: addDays(NOW, -41),
    regions: [
      {
        id: 'R-W2C-B1',
        page: 1,
        bbox: { x: 5, y: 30, w: 44, h: 11 },
        label: 'Box 1 — Wages, tips, other comp.',
        rawValue: '28,000.00',
        feedsFieldIds: ['FLD-WAGES'],
      },
      {
        id: 'R-W2C-B2',
        page: 1,
        bbox: { x: 51, y: 30, w: 44, h: 11 },
        label: 'Box 2 — Federal income tax withheld',
        rawValue: '3,900.00',
        feedsFieldIds: ['FLD-WITHHOLDING'],
      },
    ],
  },
  {
    id: 'DOC-1099INT',
    returnId: HERO_RETURN_ID,
    type: '1099-INT',
    title: '1099-INT — First National Bank',
    issuer: 'First National Bank',
    pageCount: 1,
    uploadedAt: addDays(NOW, -38),
    regions: [
      {
        id: 'R-INT-B1',
        page: 1,
        bbox: { x: 51, y: 33, w: 44, h: 12 },
        label: 'Box 1 — Interest income',
        rawValue: '1,240.00',
        feedsFieldIds: ['FLD-INTEREST'],
      },
    ],
  },
  {
    id: 'DOC-1099DIV',
    returnId: HERO_RETURN_ID,
    type: '1099-DIV',
    title: '1099-DIV — Vanguard',
    issuer: 'Vanguard Brokerage',
    pageCount: 1,
    uploadedAt: addDays(NOW, -38),
    regions: [
      {
        id: 'R-DIV-B1A',
        page: 1,
        bbox: { x: 51, y: 26, w: 44, h: 9 },
        label: 'Box 1a — Total ordinary dividends',
        rawValue: '3,180.00',
        feedsFieldIds: ['FLD-ORDDIV'],
      },
      {
        id: 'R-DIV-B1B',
        page: 1,
        bbox: { x: 51, y: 37, w: 44, h: 9 },
        label: 'Box 1b — Qualified dividends',
        rawValue: '2,950.00',
        feedsFieldIds: ['FLD-QUALDIV'],
      },
      {
        id: 'R-DIV-B2A',
        page: 1,
        bbox: { x: 51, y: 48, w: 44, h: 9 },
        label: 'Box 2a — Total capital gain distr.',
        rawValue: '540.00',
        feedsFieldIds: ['FLD-CAPGAIN'],
      },
    ],
  },
  {
    id: 'DOC-BROKERAGE',
    returnId: HERO_RETURN_ID,
    type: 'brokerage',
    title: 'Brokerage Statement — Fidelity',
    issuer: 'Fidelity Investments',
    pageCount: 1,
    uploadedAt: addDays(NOW, -12),
    regions: [
      {
        id: 'R-BRK-PROCEEDS',
        page: 1,
        bbox: { x: 6, y: 52, w: 88, h: 8 },
        label: 'Realized — Total proceeds',
        rawValue: '45,200.00',
        feedsFieldIds: ['FLD-CAPGAIN'],
      },
      {
        id: 'R-BRK-BASIS',
        page: 1,
        bbox: { x: 6, y: 61, w: 88, h: 8 },
        label: 'Realized — Total cost basis',
        rawValue: '38,900.00',
        feedsFieldIds: ['FLD-CAPGAIN'],
      },
    ],
  },
]

/* ---- Return fields (with calculations, affordances, AI) ------------------ */
export const HERO_FIELDS: ReturnField[] = [
  {
    id: 'FLD-WAGES',
    returnId: HERO_RETURN_ID,
    section: 'Income',
    line: '1040 Line 1a',
    label: 'Wages, salaries, tips',
    value: '110,450.00',
    affordance: 'verified',
    sourceRegionIds: ['R-W2I-B1', 'R-W2C-B1'],
    calculation: 'W-2 Initech Box 1 + W-2 Contoso Box 1',
    calcOperands: [
      { label: 'W-2 Initech · Box 1', value: '82,450.00' },
      { label: 'W-2 Contoso · Box 1', value: '28,000.00' },
    ],
    ai: {
      confidence: 0.97,
      did: 'Summed Box 1 wages from both W-2 forms into one 1040 line.',
      rationale:
        'Two W-2s were on file for this taxpayer. Line 1a expects the total of all Box 1 wages, so both were added.',
      suggestedValue: '110,450.00',
      evidenceRegionIds: ['R-W2I-B1', 'R-W2C-B1'],
      isWrong: false,
    },
  },
  {
    id: 'FLD-INTEREST',
    returnId: HERO_RETURN_ID,
    section: 'Income',
    line: '1040 Line 2b',
    label: 'Taxable interest',
    value: '1,240.00',
    affordance: 'ai-unverified',
    sourceRegionIds: ['R-INT-B1'],
    ai: {
      confidence: 0.52,
      did: 'Read interest income from Box 1 of the 1099-INT.',
      rationale:
        'The scan of this 1099-INT is low-contrast and Box 1 was partly faint. The read is a best guess — please confirm against the document.',
      suggestedValue: '1,240.00',
      evidenceRegionIds: ['R-INT-B1'],
      isWrong: false,
    },
  },
  {
    id: 'FLD-ORDDIV',
    returnId: HERO_RETURN_ID,
    section: 'Income',
    line: '1040 Line 3b',
    label: 'Ordinary dividends',
    value: '3,180.00',
    affordance: 'ai-unverified',
    sourceRegionIds: ['R-DIV-B1A'],
    ai: {
      confidence: 0.93,
      did: 'Read total ordinary dividends from Box 1a of the 1099-DIV.',
      rationale: 'Box 1a mapped cleanly to Line 3b. High-quality scan.',
      suggestedValue: '3,180.00',
      evidenceRegionIds: ['R-DIV-B1A'],
      isWrong: false,
    },
  },
  {
    id: 'FLD-QUALDIV',
    returnId: HERO_RETURN_ID,
    section: 'Income',
    line: '1040 Line 3a',
    label: 'Qualified dividends',
    value: '2,950.00',
    affordance: 'ai-unverified',
    sourceRegionIds: ['R-DIV-B1B'],
    ai: {
      confidence: 0.78,
      did: 'Read qualified dividends from Box 1b of the 1099-DIV.',
      rationale:
        'Box 1b is a subset of Box 1a; the values are internally consistent, so confidence is solid but not certain.',
      suggestedValue: '2,950.00',
      evidenceRegionIds: ['R-DIV-B1B'],
      isWrong: false,
    },
  },
  {
    id: 'FLD-CAPGAIN',
    returnId: HERO_RETURN_ID,
    section: 'Income',
    line: '1040 Line 7',
    label: 'Capital gain / (loss)',
    // shown value is the AI's (wrong) suggestion until a human corrects it
    value: '3,600.00',
    affordance: 'ai-unverified',
    sourceRegionIds: ['R-BRK-PROCEEDS', 'R-BRK-BASIS', 'R-DIV-B2A'],
    calculation: 'Brokerage proceeds − cost basis (+ cap-gain distributions)',
    calcOperands: [
      { label: 'Fidelity · proceeds', value: '45,200.00' },
      { label: 'Fidelity · cost basis', value: '38,900.00' },
      { label: '1099-DIV · Box 2a distr.', value: '540.00' },
    ],
    ai: {
      confidence: 0.44,
      did: 'Computed realized gain from the Fidelity statement and added cap-gain distributions.',
      rationale:
        'Proceeds minus cost basis should be 45,200 − 38,900 = 6,300, plus 540 in distributions = 6,840. The suggested value (3,600) does not reconcile — the extraction likely transposed a figure. This needs a human.',
      suggestedValue: '3,600.00',
      evidenceRegionIds: ['R-BRK-PROCEEDS', 'R-BRK-BASIS', 'R-DIV-B2A'],
      isWrong: true,
      conflict: {
        otherValue: '41,200.00',
        otherSourceLabel: 'Cost basis per the missing 1099-B (client says $41,200)',
      },
    },
  },
  {
    id: 'FLD-WITHHOLDING',
    returnId: HERO_RETURN_ID,
    section: 'Payments',
    line: '1040 Line 25a',
    label: 'Federal income tax withheld (W-2)',
    value: '16,200.00',
    affordance: 'verified',
    sourceRegionIds: ['R-W2I-B2', 'R-W2C-B2'],
    calculation: 'W-2 Initech Box 2 + W-2 Contoso Box 2',
    calcOperands: [
      { label: 'W-2 Initech · Box 2', value: '12,300.00' },
      { label: 'W-2 Contoso · Box 2', value: '3,900.00' },
    ],
    ai: {
      confidence: 0.98,
      did: 'Summed federal withholding from both W-2 Box 2 amounts.',
      rationale: 'Both Box 2 values read cleanly and were added for total withholding.',
      suggestedValue: '16,200.00',
      evidenceRegionIds: ['R-W2I-B2', 'R-W2C-B2'],
      isWrong: false,
    },
  },
  {
    id: 'FLD-AGI',
    returnId: HERO_RETURN_ID,
    section: 'Summary',
    line: '1040 Line 11',
    label: 'Adjusted gross income',
    value: '117,820.00',
    affordance: 'locked',
    sourceRegionIds: [],
    calculation: 'Sum of all income lines (system-derived)',
    calcOperands: [
      { label: 'Wages', value: '110,450.00' },
      { label: 'Interest', value: '1,240.00' },
      { label: 'Ordinary dividends', value: '3,180.00' },
      { label: 'Capital gain', value: '2,950.00' },
    ],
  },
  {
    id: 'FLD-STDDED',
    returnId: HERO_RETURN_ID,
    section: 'Summary',
    line: '1040 Line 12',
    label: 'Standard deduction',
    value: '14,600.00',
    affordance: 'locked',
    sourceRegionIds: [],
    calculation: 'IRS standard deduction, single filer, TY2025',
  },
  {
    id: 'FLD-REFUND',
    returnId: HERO_RETURN_ID,
    section: 'Summary',
    line: '1040 Line 34',
    label: 'Estimated refund',
    value: '2,480.00',
    affordance: 'requires-approval',
    sourceRegionIds: [],
    calculation: 'Payments − tax liability (pending capital-gain fix)',
  },
]

/* ---- Threads (Challenge 02) ---------------------------------------------- */
export const HERO_THREADS: Thread[] = [
  {
    id: 'TH-CAPGAIN',
    returnId: HERO_RETURN_ID,
    subject: 'Capital gains — cost basis mismatch',
    ref: { kind: 'field', id: 'FLD-CAPGAIN', label: '1040 Line 7 · Capital gain' },
    status: 'open',
    nextOwner: 'reviewer',
    messages: [
      {
        id: 'M-1',
        authorId: 'u-preparer',
        authorName: 'Marcus Reed',
        authorRole: 'preparer',
        body: 'Fidelity statement shows cost basis of $38,900 but the client mentioned a corrected 1099-B at $41,200. The AI number (3,600) is also off. Flagging for review before we lock Line 7.',
        visibility: 'internal',
        createdAt: addDays(NOW, -3),
      },
      {
        id: 'M-2',
        authorId: 'u-manager',
        authorName: 'Diane Okafor',
        authorRole: 'reviewer',
        body: "Agreed, don't lock it. Let's get the actual 1099-B from the client, then reconcile.",
        visibility: 'internal',
        createdAt: addDays(NOW, -2),
      },
      {
        id: 'M-3',
        authorId: 'u-preparer',
        authorName: 'Marcus Reed',
        authorRole: 'preparer',
        body: 'Hi Sarah — could you upload the 1099-B from Fidelity? We want to confirm the cost basis on your stock sales so your capital gains are exact.',
        visibility: 'client-visible',
        createdAt: addDays(NOW, -2),
      },
    ],
  },
  {
    id: 'TH-INTEREST',
    returnId: HERO_RETURN_ID,
    subject: 'Interest income — please confirm',
    ref: { kind: 'field', id: 'FLD-INTEREST', label: '1040 Line 2b · Taxable interest' },
    status: 'open',
    nextOwner: 'client',
    messages: [
      {
        id: 'M-4',
        authorId: 'u-preparer',
        authorName: 'Marcus Reed',
        authorRole: 'preparer',
        body: 'The 1099-INT scan is faint. We read $1,240 in interest — can you confirm that matches your statement?',
        visibility: 'client-visible',
        createdAt: addDays(NOW, -5),
      },
    ],
  },
]

/* ---- Outstanding requests (02 / 03) -------------------------------------- */
export const HERO_REQUESTS: OutstandingRequest[] = [
  {
    id: 'REQ-1099B',
    returnId: HERO_RETURN_ID,
    title: 'Upload 1099-B from Fidelity',
    detail: 'Needed to confirm cost basis on stock sales before we can finalize capital gains.',
    owner: 'client',
    status: 'open',
    dueDate: addDays(NOW, -4), // OVERDUE edge case
    createdAt: addDays(NOW, -11),
    daysWaiting: 11,
    relatedThreadId: 'TH-CAPGAIN',
    relatedDocId: 'DOC-BROKERAGE',
  },
  {
    id: 'REQ-INT',
    returnId: HERO_RETURN_ID,
    title: 'Confirm interest income of $1,240',
    detail: 'The 1099-INT scan is low quality — please confirm the amount.',
    owner: 'client',
    status: 'open',
    dueDate: addDays(NOW, 3),
    createdAt: addDays(NOW, -5),
    daysWaiting: 5,
    relatedThreadId: 'TH-INTEREST',
    relatedDocId: 'DOC-1099INT',
  },
  {
    id: 'REQ-ENGAGE',
    returnId: HERO_RETURN_ID,
    title: 'Sign engagement letter',
    detail: 'Annual engagement letter for TY2025.',
    owner: 'client',
    status: 'done',
    dueDate: addDays(NOW, -40),
    createdAt: addDays(NOW, -46),
    daysWaiting: 0,
  },
]

export const HERO_RETURN: TaxReturn = {
  id: HERO_RETURN_ID,
  clientId: 'c-chen',
  taxYear: 2025,
  formType: '1040',
  stage: 'preparation',
  preparerId: 'u-preparer',
  reviewerId: 'u-manager',
  dueDate: addDays(NOW, 24),
  progress: 0.62,
  flags: {
    blocked: true,
    overdue: false,
    lowConfidence: true,
    conflict: true,
    aiError: true,
  },
  blockingReason: 'Waiting on the client’s 1099-B to reconcile capital gains cost basis.',
  nextActionOwner: 'client',
  nextAction: 'Upload the 1099-B from Fidelity',
  daysWaitingOnClient: 11,
  openReviewFlags: 2,
  estimatedRefund: 2480,
  complexityScore: 9,
}
