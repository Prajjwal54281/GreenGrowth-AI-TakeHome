import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp, usePersona } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { HERO_RETURN_ID } from '../data/hero'
import { requestsFor, questionnaireFor } from '../data/selectors'
import { PageContainer } from '../components/PageHeader'
import { Card, Button } from '../components/ui/primitives'
import { ChallengeTag } from '../components/ChallengeTag'
import { StatusTimeline } from '../components/StatusTimeline'
import { getReturn } from '../data/selectors'
import { Icon, ICONS } from '../components/ui/Icon'

/* Challenge 03 — a brand-new client knows their next action within 10 seconds.
   One dominant primary task; navigation and detail are deferred until relevant.
   The "returning" toggle shows how the UI relaxes after onboarding. */
export function ClientHomePage() {
  const { world, dispatch } = useApp()
  const persona = usePersona()
  useTrackTrail('Home', 'home')
  const [mode, setMode] = useState<'firstRun' | 'returning'>('firstRun')

  const ret = getReturn(world, HERO_RETURN_ID)!
  const openReqs = requestsFor(world, HERO_RETURN_ID).filter((r) => r.owner === 'client' && r.status === 'open')
  const primary = [...openReqs].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
  const questions = questionnaireFor(world, HERO_RETURN_ID)
  const answered = questions.filter((q) => q.answer).length

  const steps = [
    { label: 'Engagement signed', done: true },
    { label: 'Upload documents', done: openReqs.length === 0 },
    { label: 'Answer questions', done: answered >= questions.length },
    { label: 'CPA prepares & reviews', done: false },
    { label: 'You approve & we file', done: false },
  ]
  const doneCount = steps.filter((s) => s.done).length

  return (
    <PageContainer>
      {/* demo toggle for first-run vs returning */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-ink-900">Welcome{mode === 'firstRun' ? '' : ' back'}, {persona.name.split(' ')[0]}</h1>
          <ChallengeTag ids={['03']} />
        </div>
        <div className="flex items-center rounded-lg border border-ink-200 p-0.5 text-xs font-semibold">
          <button onClick={() => setMode('firstRun')} className={`rounded-md px-2.5 py-1.5 ${mode === 'firstRun' ? 'bg-brand-700 text-white' : 'text-ink-500'}`}>First run</button>
          <button onClick={() => setMode('returning')} className={`rounded-md px-2.5 py-1.5 ${mode === 'returning' ? 'bg-brand-700 text-white' : 'text-ink-500'}`}>After onboarding</button>
        </div>
      </div>

      {/* THE one primary task — dominates the screen in first-run */}
      {primary && (
        <Card className="mb-4 overflow-hidden border-brand-200">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-100">Your next step</div>
            <div className="mt-1 text-2xl font-bold">{primary.title}</div>
            <p className="mt-1 max-w-lg text-sm text-brand-50">{primary.detail}</p>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="secondary" onClick={() => dispatch({ type: 'RESOLVE_REQUEST', requestId: primary.id })}>
                <Icon path={ICONS.items} size={15} /> Upload now
              </Button>
              <Link to={`/returns/${HERO_RETURN_ID}/threads/TH-CAPGAIN`} className="text-sm font-medium text-brand-50 hover:text-white">
                Why do you need this?
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* progress — always visible */}
      <Card className="mb-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-800">Your return · {doneCount} of {steps.length} steps</h2>
          <span className="text-2xs text-ink-400">TY{ret.taxYear}</span>
        </div>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full ${s.done ? 'bg-brand-500' : 'bg-ink-200'}`} />
              <div className={`mt-1.5 flex items-center gap-1 text-2xs ${s.done ? 'text-ink-600' : 'text-ink-400'}`}>
                {s.done && <Icon path={ICONS.check} size={11} className="text-brand-500" />}
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* progressive reveal: in first-run, defer the rest behind a gentle hint.
          in returning mode, surface the fuller set of tools. */}
      {mode === 'firstRun' ? (
        <div className="rounded-card border border-dashed border-ink-300 bg-white p-4 text-center">
          <p className="text-sm text-ink-500">
            That’s all you need to focus on right now. Your documents, questions, messages, and status
            will appear here as your return progresses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link to={`/returns/${HERO_RETURN_ID}/status`} className="group rounded-card border border-ink-200 bg-white p-4 shadow-card hover:border-brand-300">
            <Icon path={ICONS.status} size={18} className="text-brand-600" />
            <div className="mt-2 text-sm font-semibold text-ink-800">Return status</div>
            <p className="text-2xs text-ink-500">See where your return is and what’s next.</p>
          </Link>
          <Link to={`/returns/${HERO_RETURN_ID}/items`} className="group rounded-card border border-ink-200 bg-white p-4 shadow-card hover:border-brand-300">
            <Icon path={ICONS.items} size={18} className="text-brand-600" />
            <div className="mt-2 text-sm font-semibold text-ink-800">Documents & questions</div>
            <p className="text-2xs text-ink-500">{answered} of {questions.length} questions answered.</p>
          </Link>
          <Link to="/messages" className="group rounded-card border border-ink-200 bg-white p-4 shadow-card hover:border-brand-300">
            <Icon path={ICONS.messages} size={18} className="text-brand-600" />
            <div className="mt-2 text-sm font-semibold text-ink-800">Messages</div>
            <p className="text-2xs text-ink-500">Talk to your CPA about specific items.</p>
          </Link>
        </div>
      )}

      {mode === 'returning' && (
        <Card className="mt-4 p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-800">Progress detail</h2>
          <StatusTimeline ret={ret} audience="client" />
        </Card>
      )}
    </PageContainer>
  )
}
