'use client'

import { CheckIcon, Cross2Icon, ReloadIcon } from '@radix-ui/react-icons'
import { cn } from '@ui/lib/utils'
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
    .with('loading', () => <ReloadIcon className={cn('h-4 w-4 animate-spin', props.className)} />)
    .with('success', () =>
      showSuccess ? <CheckIcon className={cn('h-4 w-4', props.className)} /> : props.children,
    )
    .with('error', () =>
      showError ? (
        <Cross2Icon className={cn('h-4 w-4 text-destructive', props.className)} />
      ) : (
        props.children
      ),
    )
    .exhaustive()
}
