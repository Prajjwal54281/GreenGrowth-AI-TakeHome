import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}) {
  return (
    <Tag
      className={`rounded-card border border-ink-200 bg-white shadow-card ${className}`}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({
  title,
  subtitle,
  right,
  icon,
}: {
  title: ReactNode
  subtitle?: ReactNode
  right?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-4 py-3">
      <div className="flex items-start gap-2.5">
        {icon}
        <div>
          <h2 className="text-sm font-semibold text-ink-800">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

type Tone = 'brand' | 'ink' | 'success' | 'warning' | 'danger' | 'info' | 'ai'
const TONE: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  ink: 'bg-ink-100 text-ink-600 border-ink-200',
  success: 'bg-[--color-success-bg] text-[--color-success] border-green-200',
  warning: 'bg-[--color-warning-bg] text-[--color-warning] border-amber-200',
  danger: 'bg-[--color-danger-bg] text-[--color-danger] border-red-200',
  info: 'bg-[--color-info-bg] text-[--color-info] border-blue-200',
  ai: 'bg-[--color-aff-ai-bg] text-[--color-aff-ai] border-[--color-aff-ai-border]',
}

export function Badge({
  children,
  tone = 'ink',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-semibold ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50'
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-2 text-sm' }
  const variants = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-card',
    secondary: 'bg-white text-ink-700 border border-ink-300 hover:bg-ink-50',
    ghost: 'text-ink-600 hover:bg-ink-100',
    danger: 'bg-[--color-danger] text-white hover:brightness-95',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-ink-200/70 ${className}`} />
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-12 text-center">
      <p className="text-sm font-medium text-ink-600">{title}</p>
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  )
}
