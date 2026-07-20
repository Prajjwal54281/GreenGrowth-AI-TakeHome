/* ============================================================================
   PRIORITIZATION LOGIC: Challenge 07 "Actionable Dashboard"
   Real, inspectable ranking. Given a return, produce a numeric urgency score
   AND the human-readable reasons behind it, so the dashboard can explain WHY
   something is at the top of the queue ("Due in 2 days · Blocked 14 days").
   ========================================================================== */

import type { TaxReturn } from '../data/types'
import { daysBetween, NOW } from '../data/rng'
import { stageOrder } from '../data/stages'

export interface PriorityReason {
  label: string
  /** points this reason contributed */
  weight: number
  tone: 'danger' | 'warning' | 'info'
}

export interface RankedReturn {
  ret: TaxReturn
  score: number
  reasons: PriorityReason[]
  /** the single most important reason, for compact display */
  headline: string
}

const CLAMP = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

export function scoreReturn(ret: TaxReturn, now: string = NOW): RankedReturn {
  const reasons: PriorityReason[] = []
  let score = 0

  // filed returns are done, near-zero priority
  if (ret.stage === 'filed') {
    return { ret, score: 0, reasons: [{ label: 'Filed', weight: 0, tone: 'info' }], headline: 'Filed' }
  }

  // 1. Deadline proximity, the dominant factor. Overdue is worst.
  const daysToDue = daysBetween(now, ret.dueDate)
  if (daysToDue < 0) {
    const w = CLAMP(40 + Math.abs(daysToDue) * 1.5, 40, 90)
    score += w
    reasons.push({ label: `Overdue by ${Math.abs(daysToDue)}d`, weight: w, tone: 'danger' })
  } else if (daysToDue <= 7) {
    const w = 45 - daysToDue * 4
    score += w
    reasons.push({ label: `Due in ${daysToDue}d`, weight: w, tone: 'danger' })
  } else if (daysToDue <= 21) {
    const w = 20 - (daysToDue - 7)
    score += w
    reasons.push({ label: `Due in ${daysToDue}d`, weight: w, tone: 'warning' })
  } else {
    reasons.push({ label: `Due in ${daysToDue}d`, weight: 0, tone: 'info' })
  }

  // 2. Blocked / waiting on the client, the ball is out of the firm's court,
  //    and the longer it sits the more it needs a nudge.
  if (ret.daysWaitingOnClient > 0) {
    const w = CLAMP(ret.daysWaitingOnClient * 1.6, 0, 30)
    score += w
    reasons.push({
      label: `Waiting on client ${ret.daysWaitingOnClient}d`,
      weight: w,
      tone: ret.daysWaitingOnClient > 10 ? 'danger' : 'warning',
    })
  }
  if (ret.flags.blocked) {
    score += 12
    reasons.push({ label: 'Blocked', weight: 12, tone: 'danger' })
  }

  // 3. Review flags raised by a reviewer.
  if (ret.openReviewFlags > 0) {
    const w = ret.openReviewFlags * 6
    score += w
    reasons.push({ label: `${ret.openReviewFlags} review flag${ret.openReviewFlags > 1 ? 's' : ''}`, weight: w, tone: 'warning' })
  }

  // 4. AI trust signals, a wrong or conflicting AI value needs a human now.
  if (ret.flags.aiError) {
    score += 15
    reasons.push({ label: 'AI value needs correction', weight: 15, tone: 'danger' })
  }
  if (ret.flags.conflict) {
    score += 10
    reasons.push({ label: 'Conflicting sources', weight: 10, tone: 'warning' })
  }
  if (ret.flags.lowConfidence) {
    score += 5
    reasons.push({ label: 'Low-confidence extraction', weight: 5, tone: 'info' })
  }

  // 5. Small nudge for returns nearer the finish line so they don't stall at the gate.
  score += stageOrder(ret.stage)

  reasons.sort((a, b) => b.weight - a.weight)
  const headline = reasons[0]?.label ?? 'On track'

  return { ret, score: Math.round(score), reasons, headline }
}

export function rankReturns(returns: TaxReturn[], now: string = NOW): RankedReturn[] {
  return returns
    .map((r) => scoreReturn(r, now))
    .sort((a, b) => b.score - a.score)
}
