'use client'

import { cn } from '@ui/lib/utils'
import { Check, Loader2, X } from 'lucide-react'
import { useState, useLayoutEffect } from 'react'
import { match } from 'ts-pattern'

export function MutationStatusIcon(props: {
  status: 'idle' | 'loading' | 'success' | 'error'
  className?: string
  children?: React.ReactNode
}) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  useLayoutEffect(() => {
    let timeout: number | null = null
    if (props.status === 'success') {
      setShowSuccess(true)
      timeout = setTimeout(() => {
        setShowSuccess(false)
      }, 2_000)
    }

    if (props.status === 'error') {
      setShowError(true)
      timeout = setTimeout(() => {
        setShowError(false)
      }, 2_000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [props.status])

  return match(props.status)
    .with('idle', () => props.children)
    .with('loading', () => <Loader2 className={cn('h-4 w-4 animate-spin', props.className)} />)
    .with('success', () =>
      showSuccess ? <Check className={cn('h-4 w-4', props.className)} /> : props.children,
    )
    .with('error', () =>
      showError ? (
        <X className={cn('h-4 w-4 text-destructive', props.className)} />
      ) : (
        props.children
      ),
    )
    .exhaustive()
}
