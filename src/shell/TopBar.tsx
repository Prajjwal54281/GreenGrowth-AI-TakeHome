import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { useApp, usePersona } from '../state/AppState'
import { useDemoGuide } from '../state/DemoGuide'
import { useNavTrail } from '../state/NavTrail'
import { PERSONAS } from '../data/personas'
import { Icon, ICONS } from '../components/ui/Icon'

function Avatar({ initials, color, size = 28 }: { initials: string; color: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  )
}

export function TopBar() {
  const { personaId, contextMode, dispatch } = useApp()
  const persona = usePersona()
  const demo = useDemoGuide()
  const { trail } = useNavTrail()
  const navigate = useNavigate()
  const [personaOpen, setPersonaOpen] = useState(false)
  const [trailOpen, setTrailOpen] = useState(false)

  const isStaffPersonal = !!persona.personalClientId && persona.primaryRole !== 'client'

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-ink-200 bg-white px-5">
      <Breadcrumbs />

      <div className="flex items-center gap-2">
        {/* Back-to-where-I-was trail (Challenge 04) */}
        {trail.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setTrailOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50"
            >
              <Icon path={ICONS.arrowLeft} size={14} />
              Recently viewed
              <Icon path={ICONS.chevronDown} size={12} />
            </button>
            {trailOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setTrailOpen(false)} />
                <div className="absolute right-0 z-50 mt-1 w-64 rounded-xl border border-ink-200 bg-white p-1.5 shadow-panel">
                  <div className="px-2 py-1 text-2xs font-semibold uppercase tracking-wide text-ink-400">
                    Jump back to
                  </div>
                  {[...trail].reverse().map((t) => (
                    <button
                      key={t.path}
                      onClick={() => {
                        navigate(t.path)
                        setTrailOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-ink-700 hover:bg-ink-50"
                    >
                      <span className="rounded bg-ink-100 px-1 text-2xs font-semibold text-ink-500">
                        {t.kind}
                      </span>
                      <span className="truncate">{t.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Demo Guide (for the reviewer) */}
        <button
          onClick={demo.toggle}
          className="flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800"
        >
          <Icon path={ICONS.guide} size={14} />
          Demo Guide
        </button>

        <div className="mx-1 h-6 w-px bg-ink-200" />

        {/* Staff / personal context switch, 05 edge case */}
        {isStaffPersonal && (
          <div className="flex items-center rounded-lg border border-ink-200 p-0.5 text-xs font-semibold">
            <button
              onClick={() => {
                dispatch({ type: 'SET_CONTEXT_MODE', mode: 'staff' })
                navigate('/dashboard')
              }}
              className={`rounded-md px-2 py-1 ${contextMode === 'staff' ? 'bg-ink-800 text-white' : 'text-ink-500'}`}
            >
              Staff mode
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'SET_CONTEXT_MODE', mode: 'personal' })
                navigate('/home')
              }}
              className={`rounded-md px-2 py-1 ${contextMode === 'personal' ? 'bg-brand-700 text-white' : 'text-ink-500'}`}
            >
              My taxes
            </button>
          </div>
        )}

        {/* Persona switcher (Challenge 05) */}
        <div className="relative">
          <button
            onClick={() => setPersonaOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-ink-200 py-1 pl-1 pr-2 hover:bg-ink-50"
          >
            <Avatar initials={persona.initials} color={persona.color} />
            <div className="text-left leading-tight">
              <div className="text-xs font-semibold text-ink-800">{persona.name}</div>
              <div className="text-2xs text-ink-400">{persona.title}</div>
            </div>
            <Icon path={ICONS.chevronDown} size={14} className="text-ink-400" />
          </button>
          {personaOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPersonaOpen(false)} />
              <div className="absolute right-0 z-50 mt-1 w-80 rounded-xl border border-ink-200 bg-white p-1.5 shadow-panel">
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-2xs font-semibold uppercase tracking-wide text-ink-400">
                  <Icon path={ICONS.swap} size={13} /> Switch persona
                </div>
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      dispatch({ type: 'SET_PERSONA', personaId: p.id })
                      setPersonaOpen(false)
                      navigate(p.primaryRole === 'client' ? '/home' : '/dashboard')
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-lg p-2 text-left ${
                      p.id === personaId ? 'bg-brand-50' : 'hover:bg-ink-50'
                    }`}
                  >
                    <Avatar initials={p.initials} color={p.color} size={30} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-800">
                        {p.name}
                        {p.personalClientId && p.primaryRole !== 'client' && (
                          <span className="rounded bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
                            STAFF + CLIENT
                          </span>
                        )}
                      </div>
                      <div className="text-2xs text-ink-500">{p.blurb}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
