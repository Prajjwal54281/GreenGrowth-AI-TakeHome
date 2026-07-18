import { useDemoGuide } from '../state/DemoGuide'
import { CHALLENGE_BY_ID } from '../data/challenges'
import { Tooltip } from './ui/Tooltip'

/* A tiny "Challenge NN" marker shown on the screens that demonstrate a
   challenge, so a reviewer always knows which requirement they're looking at.
   Clicking opens the Demo Guide. */
export function ChallengeTag({ ids }: { ids: string[] }) {
  const demo = useDemoGuide()
  return (
    <span className="inline-flex items-center gap-1">
      {ids.map((id) => {
        const c = CHALLENGE_BY_ID[id]
        return (
          <Tooltip key={id} width={220} content={<span>{c?.title}: {c?.oneLiner}</span>}>
            <button
              onClick={demo.toggle}
              className="rounded-md bg-ink-800 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white hover:bg-ink-700"
            >
              {id}
            </button>
          </Tooltip>
        )
      })}
    </span>
  )
}
