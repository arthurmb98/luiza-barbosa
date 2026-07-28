import * as React from 'react'
import { cn } from '@/lib/utils'

function Badge({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent',
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
