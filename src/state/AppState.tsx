/* ============================================================================
   APP STATE
   One in-memory, reactive store for the whole prototype. Holds the current
   persona (Challenge 05) and a MUTABLE copy of the seeded world so that
   corrections made on the review screen (Challenge 10) visibly ripple out to
   the dashboard and status views. No backend — this is the "fake" layer, made
   honest: mutations are real state changes, reads simulate latency elsewhere.
   ========================================================================== */

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { SeedWorld, ReturnField } from '../data/types'
import { WORLD } from '../data/world'
import { PERSONA_BY_ID } from '../data/personas'
import { HERO_RETURN_ID } from '../data/hero'
import { confidenceBand } from '../design/affordances'

/** deep clone so we never mutate the frozen seed module */
function cloneWorld(w: SeedWorld): SeedWorld {
  return structuredClone(w)
}

interface State {
  world: SeedWorld
  personaId: string
  /** 05 edge case: staff-with-personal-return toggles between these */
  contextMode: 'staff' | 'personal'
  /** ids of fields the user has just changed, for a brief highlight */
  recentlyChanged: string[]
}

type Action =
  | { type: 'SET_PERSONA'; personaId: string }
  | { type: 'SET_CONTEXT_MODE'; mode: 'staff' | 'personal' }
  | { type: 'ACCEPT_AI'; fieldId: string }
  | { type: 'EDIT_FIELD'; fieldId: string; value: string }
  | { type: 'REJECT_AI'; fieldId: string }
  | { type: 'VERIFY_FIELD'; fieldId: string }
  | { type: 'RESOLVE_REQUEST'; requestId: string }
  | { type: 'ADD_MESSAGE'; threadId: string; body: string; visibility: 'internal' | 'client-visible' }
  | { type: 'ANSWER_QUESTION'; itemId: string; answer: string }

/** Recompute the hero return's flags + progress from its live fields so the
 *  dashboard and status views always reflect the latest corrections. */
function recomputeHero(world: SeedWorld) {
  const ret = world.returns.find((r) => r.id === HERO_RETURN_ID)
  if (!ret) return
  const fields = world.fields.filter((f) => f.returnId === HERO_RETURN_ID)
  const unresolvedWrong = fields.some(
    (f) => f.ai?.isWrong && f.affordance !== 'verified',
  )
  const unresolvedConflict = fields.some(
    (f) => f.ai?.conflict && f.affordance !== 'verified',
  )
  const unresolvedLowConf = fields.some(
    (f) => f.ai && confidenceBand(f.ai.confidence) === 'low' && f.affordance === 'ai-unverified',
  )
  ret.flags.aiError = unresolvedWrong
  ret.flags.conflict = unresolvedConflict
  ret.flags.lowConfidence = unresolvedLowConf

  const incomeFields = fields.filter((f) => f.section === 'Income')
  const verified = incomeFields.filter((f) => f.affordance === 'verified').length
  const base = 0.45
  ret.progress = Math.min(1, base + (verified / Math.max(1, incomeFields.length)) * 0.5)

  const openFlags =
    (unresolvedWrong ? 1 : 0) + (unresolvedConflict ? 1 : 0) + (unresolvedLowConf ? 1 : 0)
  ret.openReviewFlags = openFlags
  ret.flags.blocked = world.requests.some(
    (rq) => rq.returnId === HERO_RETURN_ID && rq.owner === 'client' && rq.status === 'open',
  )
}

function markChanged(state: State, fieldId: string): string[] {
  return [fieldId, ...state.recentlyChanged.filter((id) => id !== fieldId)].slice(0, 6)
}

function withField(world: SeedWorld, fieldId: string, fn: (f: ReturnField) => void) {
  const f = world.fields.find((x) => x.id === fieldId)
  if (f) fn(f)
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PERSONA':
      return { ...state, personaId: action.personaId, contextMode: 'staff' }
    case 'SET_CONTEXT_MODE':
      return { ...state, contextMode: action.mode }

    case 'ACCEPT_AI': {
      const world = cloneWorld(state.world)
      withField(world, action.fieldId, (f) => {
        if (f.ai) f.value = f.ai.suggestedValue
        f.affordance = 'verified'
      })
      recomputeHero(world)
      return { ...state, world, recentlyChanged: markChanged(state, action.fieldId) }
    }
    case 'EDIT_FIELD': {
      const world = cloneWorld(state.world)
      withField(world, action.fieldId, (f) => {
        f.value = action.value
        f.affordance = 'verified'
      })
      recomputeHero(world)
      return { ...state, world, recentlyChanged: markChanged(state, action.fieldId) }
    }
    case 'REJECT_AI': {
      const world = cloneWorld(state.world)
      withField(world, action.fieldId, (f) => {
        // rejecting the AI hands the field back to a human to enter directly
        f.affordance = 'editable'
      })
      recomputeHero(world)
      return { ...state, world, recentlyChanged: markChanged(state, action.fieldId) }
    }
    case 'VERIFY_FIELD': {
      const world = cloneWorld(state.world)
      withField(world, action.fieldId, (f) => {
        f.affordance = 'verified'
      })
      recomputeHero(world)
      return { ...state, world, recentlyChanged: markChanged(state, action.fieldId) }
    }
    case 'RESOLVE_REQUEST': {
      const world = cloneWorld(state.world)
      const rq = world.requests.find((r) => r.id === action.requestId)
      if (rq) {
        rq.status = 'done'
        rq.daysWaiting = 0
      }
      recomputeHero(world)
      return { ...state, world }
    }
    case 'ADD_MESSAGE': {
      const world = cloneWorld(state.world)
      const th = world.threads.find((t) => t.id === action.threadId)
      const persona = PERSONA_BY_ID[state.personaId]
      if (th && persona) {
        th.messages.push({
          id: `M-${Date.now()}`,
          authorId: persona.id,
          authorName: persona.name,
          authorRole: persona.primaryRole,
          body: action.body,
          visibility: action.visibility,
          createdAt: new Date().toISOString().slice(0, 10),
        })
      }
      return { ...state, world }
    }
    case 'ANSWER_QUESTION': {
      const world = cloneWorld(state.world)
      const q = world.questionnaire.find((i) => i.id === action.itemId)
      if (q) {
        q.answer = action.answer
        q.affordance = 'verified'
      }
      return { ...state, world }
    }
    default:
      return state
  }
}

interface AppStateValue {
  world: SeedWorld
  personaId: string
  contextMode: 'staff' | 'personal'
  recentlyChanged: string[]
  dispatch: React.Dispatch<Action>
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    world: cloneWorld(WORLD),
    personaId: 'u-preparer',
    contextMode: 'staff' as const,
    recentlyChanged: [],
  }))

  const value = useMemo<AppStateValue>(
    () => ({
      world: state.world,
      personaId: state.personaId,
      contextMode: state.contextMode,
      recentlyChanged: state.recentlyChanged,
      dispatch,
    }),
    [state],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useApp must be used within AppStateProvider')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePersona() {
  const { personaId } = useApp()
  return PERSONA_BY_ID[personaId]
}

/** The role the shell should render as right now. For the staff-with-personal
 *  edge case, "personal" mode makes the firm employee look like a client. */
// eslint-disable-next-line react-refresh/only-export-components
export function useEffectiveRole() {
  const { personaId, contextMode } = useApp()
  const persona = PERSONA_BY_ID[personaId]
  if (persona.personalClientId && persona.primaryRole !== 'client' && contextMode === 'personal') {
    return 'client' as const
  }
  return persona.primaryRole
}
