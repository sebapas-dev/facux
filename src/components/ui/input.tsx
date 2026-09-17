import * as React from 'react'
import { cn } from '@/lib/cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-12 w-full rounded-md border-2 border-reddish-brown bg-light-yellow px-5 text-center font-body text-lg text-reddish-brown shadow-pop-sm placeholder:text-reddish-brown/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tangerine/50',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
