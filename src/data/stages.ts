/* ============================================================================
   STATUS MODEL: Challenge 06
   ONE ordered set of stages. The client rendering uses `clientLabel` (plain
   language, no firm jargon); the staff rendering uses `staffLabel`. Both read
   from this single source so they can never drift apart.
   ========================================================================== */

import type { Stage, StageDef, OwnerRole } from './types'

export const STAGES: StageDef[] = [
  { stage: 'intake', clientLabel: 'Getting started', staffLabel: 'Intake & engagement', order: 0 },
  { stage: 'documents', clientLabel: 'Sending documents', staffLabel: 'Document collection', order: 1 },
  { stage: 'preparation', clientLabel: "We're preparing your return", staffLabel: 'In preparation', order: 2 },
  { stage: 'review', clientLabel: 'Final review by your CPA', staffLabel: 'In review', order: 3 },
  { stage: 'signoff', clientLabel: 'Your approval needed', staffLabel: 'Awaiting client sign-off', order: 4 },
  { stage: 'filed', clientLabel: 'Filed', staffLabel: 'Filed & closed', order: 5 },
]

export const STAGE_BY_ID: Record<Stage, StageDef> = Object.fromEntries(
  STAGES.map((s) => [s.stage, s]),
) as Record<Stage, StageDef>

export function stageOrder(stage: Stage): number {
  return STAGE_BY_ID[stage].order
}

/** plain-language description of who owns the next move at each stage */
export const OWNER_LABEL: Record<OwnerRole, string> = {
  client: 'Client',
  preparer: 'Preparer',
  reviewer: 'Reviewer',
  firm: 'Firm',
}

/** "what happens next" phrased for a client, per stage */
export const CLIENT_NEXT: Record<Stage, string> = {
  intake: 'Answer a few questions so we can set up your return.',
  documents: 'Upload the documents we requested.',
  preparation: 'Nothing needed from you. We’ll reach out if we have questions.',
  review: 'Nothing needed from you. Your CPA is doing the final check.',
  signoff: 'Review your finished return and approve it for filing.',
  filed: 'All done. Your return has been filed.',
}
