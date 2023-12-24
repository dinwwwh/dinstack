import { Alert, AlertTitle, AlertDescription } from './alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import type { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<typeof Alert> & {
  title?: string
  description?: string
}

export function GeneralError({ title, description, ...props }: Props) {
  return (
    <Alert variant="destructive" {...props}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{title || 'Something went wrong'}</AlertTitle>
      <AlertDescription>{description || 'Please try again later'}</AlertDescription>
    </Alert>
  )
}
