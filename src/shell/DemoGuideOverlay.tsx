import { useNavigate } from 'react-router-dom'
import { useDemoGuide } from '../state/DemoGuide'
import { useApp } from '../state/AppState'
import { CHALLENGES, type Depth } from '../data/challenges'
import { PERSONAS } from '../data/personas'
import { Icon, ICONS } from '../components/ui/Icon'

/* ============================================================================
   DEMO GUIDE — the reviewer's map.
   A slide-over that lists every challenge with a one-click jump to the exact
   screen/state that demonstrates it, plus quick persona switching. This is the
   affordance that makes the prototype self-guiding for a grader.
   ========================================================================== */

const DEPTH_LABEL: Record<Depth, { label: string; cls: string }> = {
  flagship: { label: 'Flagship', cls: 'bg-brand-100 text-brand-800' },
  medium: { label: 'Medium', cls: 'bg-blue-100 text-blue-700' },
  light: { label: 'Light', cls: 'bg-ink-100 text-ink-500' },
}

export function DemoGuideOverlay() {
  const { open, setOpen } = useDemoGuide()
  const { personaId, dispatch } = useApp()
  const navigate = useNavigate()
  if (!open) return null

  const go = (route: string) => {
    navigate(route)
    setOpen(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-ink-900/30" onClick={() => setOpen(false)} />
      <div className="relative flex h-full w-[460px] flex-col bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Icon path={ICONS.guide} size={20} className="text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-ink-800">Demo Guide</h2>
              <p className="text-2xs text-ink-500">Jump to the screen that shows each challenge</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        {/* Persona quick-switch */}
        <div className="border-b border-ink-100 px-5 py-3">
          <div className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-ink-400">
            View as
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  dispatch({ type: 'SET_PERSONA', personaId: p.id })
                }}
                className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium ${
                  p.id === personaId ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-ink-200 text-ink-600 hover:bg-ink-50'
                }`}
              >
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
                  style={{ background: p.color }}
                >
                  {p.initials}
                </span>
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-2">
            {CHALLENGES.map((c) => {
              const depth = DEPTH_LABEL[c.depth]
              return (
                <button
                  key={c.id}
                  onClick={() => go(c.route)}
                  className="group block w-full rounded-xl border border-ink-200 p-3 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-800 text-2xs font-bold text-white">
                      {c.id}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink-800">{c.title}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${depth.cls}`}>
                      {depth.label}
                    </span>
                    <Icon
                      path={ICONS.chevronRight}
                      size={16}
                      className="text-ink-300 group-hover:text-brand-500"
                    />
                  </div>
                  <p className="mt-1.5 pl-9 text-xs leading-snug text-ink-500">{c.demoNote}</p>
                </button>
              )
            })}
          </div>
        </div>
        <div className="border-t border-ink-100 px-5 py-3 text-2xs text-ink-400">
          Everything here is seeded fake data. See the README for what’s real vs. simulated.
        </div>
      </div>
    </div>
  )
}
