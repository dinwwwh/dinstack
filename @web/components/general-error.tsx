import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { AlertTriangleIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<typeof Alert> & {
  title?: string
  description?: string
}

export function GeneralError({ title, description, ...props }: Props) {
  return (
    <Alert variant="destructive" {...props}>
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle>{title || 'Something went wrong'}</AlertTitle>
      <AlertDescription>{description || 'Please try again later'}</AlertDescription>
    </Alert>
  )
}
