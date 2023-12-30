import { cn } from '@web/lib/utils'
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react'
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
      timeout = window.setTimeout(() => {
        setShowSuccess(false)
      }, 2_000)
    }

    if (props.status === 'error') {
      setShowError(true)
      timeout = window.setTimeout(() => {
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
    .with('loading', () => <Loader2Icon className={cn('h-4 w-4 animate-spin', props.className)} />)
    .with('success', () =>
      showSuccess ? <CheckIcon className={cn('h-4 w-4', props.className)} /> : props.children,
    )
    .with('error', () =>
      showError ? <XIcon className={cn('h-4 w-4', props.className)} /> : props.children,
    )
    .exhaustive()
}
