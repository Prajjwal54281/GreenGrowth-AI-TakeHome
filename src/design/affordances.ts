/* ============================================================================
   AFFORDANCE SYSTEM — Challenge 08 "Clickable vs. Editable"
   ----------------------------------------------------------------------------
   One vocabulary of value-states, used on EVERY screen that shows a value.
   Each state answers, at a glance: can I trust this? can I change it? who can?
   The colors here map 1:1 to the --color-aff-* tokens in index.css so the
   visual language is identical whether a value appears on the review screen,
   the dashboard, or a questionnaire.
   ========================================================================== */

export type AffordanceState =
  | 'ai-unverified'
  | 'verified'
  | 'editable'
  | 'requires-approval'
  | 'locked'

export interface AffordanceMeta {
  state: AffordanceState
  label: string
  /** the "why is it in this state" shown on hover */
  why: string
  /** short verb describing what you can do */
  action: string
  icon: string // inline svg path data (24x24 viewBox)
  /** tailwind classes derived from the --color-aff-* tokens */
  text: string
  bg: string
  border: string
  dot: string
  /** whether a click opens an edit affordance */
  interactive: boolean
}

export const AFFORDANCES: Record<AffordanceState, AffordanceMeta> = {
  'ai-unverified': {
    state: 'ai-unverified',
    label: 'AI · Unverified',
    why: 'Extracted or suggested by the AI. No person has confirmed it yet — review before you rely on it.',
    action: 'Review & verify',
    icon: 'M12 2 3 7v6c0 5 3.8 8.3 9 9 5.2-.7 9-4 9-9V7l-9-5Zm0 6a2.2 2.2 0 0 1 1 4.1V15h-2v-2.9A2.2 2.2 0 0 1 12 8Z',
    text: 'text-[--color-aff-ai]',
    bg: 'bg-[--color-aff-ai-bg]',
    border: 'border-[--color-aff-ai-border]',
    dot: 'bg-[--color-aff-ai]',
    interactive: true,
  },
  verified: {
    state: 'verified',
    label: 'Verified',
    why: 'A person has reviewed this value against its source and confirmed it. Safe to rely on.',
    action: 'View source',
    icon: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
    text: 'text-[--color-aff-verified]',
    bg: 'bg-[--color-aff-verified-bg]',
    border: 'border-[--color-aff-verified-border]',
    dot: 'bg-[--color-aff-verified]',
    interactive: true,
  },
  editable: {
    state: 'editable',
    label: 'Editable',
    why: 'You have permission to change this value directly. Your edit becomes a verified, human-entered value.',
    action: 'Click to edit',
    icon: 'M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z',
    text: 'text-[--color-aff-editable]',
    bg: 'bg-[--color-aff-editable-bg]',
    border: 'border-[--color-aff-editable-border]',
    dot: 'bg-[--color-aff-editable]',
    interactive: true,
  },
  'requires-approval': {
    state: 'requires-approval',
    label: 'Needs approval',
    why: 'This value was changed and is waiting on a reviewer to sign off before it is final.',
    action: 'Send for approval',
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2Zm0-4h-2V7h2Z',
    text: 'text-[--color-aff-approval]',
    bg: 'bg-[--color-aff-approval-bg]',
    border: 'border-[--color-aff-approval-border]',
    dot: 'bg-[--color-aff-approval]',
    interactive: true,
  },
  locked: {
    state: 'locked',
    label: 'Locked',
    why: 'Read-only. Either the return is filed, or this figure is derived by the system and cannot be edited by hand.',
    action: 'Locked',
    icon: 'M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm2.2-9H9.8V6a2.2 2.2 0 0 1 4.4 0Z',
    text: 'text-[--color-aff-locked]',
    bg: 'bg-[--color-aff-locked-bg]',
    border: 'border-[--color-aff-locked-border]',
    dot: 'bg-[--color-aff-locked]',
    interactive: false,
  },
}

export const AFFORDANCE_ORDER: AffordanceState[] = [
  'ai-unverified',
  'verified',
  'editable',
  'requires-approval',
  'locked',
]

/* ---- Confidence (Challenge 10) ------------------------------------------- */
export type ConfidenceBand = 'high' | 'medium' | 'low'

export function confidenceBand(score: number): ConfidenceBand {
  if (score >= 0.85) return 'high'
  if (score >= 0.6) return 'medium'
  return 'low'
}

export const CONFIDENCE_META: Record<
  ConfidenceBand,
  { label: string; text: string; bg: string; ring: string; bars: number; why: string }
> = {
  high: {
    label: 'High confidence',
    text: 'text-[--color-conf-high]',
    bg: 'bg-[--color-conf-high]',
    ring: 'ring-[--color-conf-high]',
    bars: 3,
    why: 'The source was clean and the value matched an expected pattern. Still worth a glance.',
  },
  medium: {
    label: 'Medium confidence',
    text: 'text-[--color-conf-medium]',
    bg: 'bg-[--color-conf-medium]',
    ring: 'ring-[--color-conf-medium]',
    bars: 2,
    why: 'The AI is fairly sure but something was ambiguous — worth confirming against the document.',
  },
  low: {
    label: 'Low confidence',
    text: 'text-[--color-conf-low]',
    bg: 'bg-[--color-conf-low]',
    ring: 'ring-[--color-conf-low]',
    bars: 1,
    why: 'The source was blurry, unusual, or conflicting. Treat as a draft and verify before relying on it.',
  },
}
