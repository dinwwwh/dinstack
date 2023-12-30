import { MutationStatusIcon } from '../mutation-status-icon'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { api } from '@web/lib/api'
import { useRef } from 'react'

type Props = React.ComponentPropsWithoutRef<typeof AlertDialog> & {
  organizationId: string
  onSuccess?: () => void
}

export function OrganizationDeleteAlertDialog({
  organizationId,
  children,
  onSuccess,
  ...props
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const mutation = api.organization.delete.useMutation({
    onSuccess() {
      cancelRef.current?.click()
      onSuccess?.()
    },
  })

  return (
    <AlertDialog {...props}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data associated with this organization will be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
          <Button
            variant={'destructive'}
            className="gap-2"
            disabled={mutation.isLoading}
            onClick={() =>
              mutation.mutate({
                organizationId,
              })
            }
          >
            Continue <MutationStatusIcon status={mutation.status} />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
