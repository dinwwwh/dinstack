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
  invitationEmail: string
  onSuccess?: () => void
}

export function InvitationDeleteAlertDialog({
  organizationId,
  invitationEmail,
  children,
  onSuccess,
  ...props
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const mutation = api.organization.invitation.delete.useMutation({
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
            This action cannot be undone. By proceeding, the invitation will be deleted and will no
            longer be valid.
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
                invitationEmail,
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
