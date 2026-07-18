import type { ReactNode } from 'react'
import { ChallengeTag } from './ChallengeTag'

export function PageContainer({
  children,
  wide = false,
}: {
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className={`mx-auto w-full ${wide ? 'max-w-[1400px]' : 'max-w-6xl'} px-6 py-6`}>
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  challenges,
  right,
}: {
  title: ReactNode
  subtitle?: ReactNode
  challenges?: string[]
  right?: ReactNode
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-ink-900">{title}</h1>
          {challenges && <ChallengeTag ids={challenges} />}
        </div>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  )
}
