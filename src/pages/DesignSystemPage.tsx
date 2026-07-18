import { Link } from 'react-router-dom'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card, CardHeader } from '../components/ui/primitives'
import { AffordanceLegend, } from '../components/affordance/AffordanceLegend'
import { AffordanceValue } from '../components/affordance/AffordanceValue'
import { ConfidenceMeter } from '../components/affordance/ConfidenceMeter'
import { AFFORDANCE_ORDER } from '../design/affordances'
import { HERO_RETURN_ID } from '../data/hero'

/* Challenge 08 — the legend/key plus the same affordance system shown across
   several contexts (a form field, a table cell, a questionnaire answer). */
export function DesignSystemPage() {
  useTrackTrail('Design system', 'design')
  return (
    <PageContainer>
      <PageHeader
        title="Affordance system"
        subtitle="One visual language for value-states, used on every screen. Hover any value for its “why”."
        challenges={['08']}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader title="The key" subtitle="Five states a value can be in" />
          <div className="p-4">
            <AffordanceLegend />
          </div>
        </Card>

        <div className="space-y-4">
          {/* Context 1: a form field */}
          <Card>
            <CardHeader title="On a return field" subtitle="Review screen — click-to-edit where editable" />
            <div className="flex flex-wrap items-center gap-3 p-4">
              {AFFORDANCE_ORDER.map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <AffordanceValue state={s} onEdit={() => {}}>$12,300</AffordanceValue>
                  <span className="text-2xs text-ink-400">{s}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Context 2: a table */}
          <Card>
            <CardHeader title="In a table cell" subtitle="Same states, denser layout" />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-2xs uppercase text-ink-400">
                  <th className="px-4 py-2 font-semibold">Field</th>
                  <th className="px-4 py-2 font-semibold">Value</th>
                  <th className="px-4 py-2 font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { l: 'Wages', v: '$110,450', s: 'verified' as const, c: 0.97 },
                  { l: 'Interest', v: '$1,240', s: 'ai-unverified' as const, c: 0.52 },
                  { l: 'Capital gain', v: '$3,600', s: 'ai-unverified' as const, c: 0.44 },
                  { l: 'Refund', v: '$2,480', s: 'requires-approval' as const, c: 1 },
                  { l: 'Std deduction', v: '$14,600', s: 'locked' as const, c: 1 },
                ].map((r) => (
                  <tr key={r.l} className="border-b border-ink-50 last:border-0">
                    <td className="px-4 py-2 text-ink-700">{r.l}</td>
                    <td className="px-4 py-2"><AffordanceValue state={r.s} size="sm">{r.v}</AffordanceValue></td>
                    <td className="px-4 py-2">
                      {r.s === 'ai-unverified' ? <ConfidenceMeter score={r.c} size="sm" /> : <span className="text-2xs text-ink-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-ink-600">
              See it live on the{' '}
              <Link to={`/returns/${HERO_RETURN_ID}/review`} className="font-semibold text-brand-700 hover:underline">
                Review screen
              </Link>{' '}
              and the{' '}
              <Link to={`/returns/${HERO_RETURN_ID}/items`} className="font-semibold text-brand-700 hover:underline">
                Items explorer
              </Link>
              . The states are defined once as design tokens in{' '}
              <code className="rounded bg-ink-100 px-1 text-ink-600">src/design/affordances.ts</code>.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
