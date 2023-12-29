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
import type { OauthAccounts } from '@api/database/schema'
import { api } from '@web/lib/api'
import { useRef } from 'react'

type Props = React.ComponentPropsWithoutRef<typeof AlertDialog> & {
  provider: (typeof OauthAccounts.$inferSelect)['provider']
}

export function OauthDisconnectAlertDialog({ provider, children, ...props }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const mutation = api.auth.oauth.disconnect.useMutation({
    onSuccess() {
      cancelRef.current?.click()
    },
  })

  return (
    <AlertDialog {...props}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will no longer be able to sign in with this account.
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
                provider,
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
