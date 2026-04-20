import { cn } from '@/lib/utils'

function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        className
      )}
    />
  )
}

export { Spinner }