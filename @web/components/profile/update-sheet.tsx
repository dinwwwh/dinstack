import { GeneralError } from '../general-error'
import { GeneralSkeleton } from '../general-skeleton'
import { MutationStatusIcon } from '../mutation-status-icon'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@ui/components/ui/sheet'
import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { useId, useRef } from 'react'
import { match } from 'ts-pattern'

type Props = React.ComponentPropsWithoutRef<typeof Sheet> & {
  onSuccess?: () => void
}

export function ProfileUpdateSheet({ children, onSuccess, ...props }: Props) {
  const nameId = useId()
  const closeElement = useRef<HTMLButtonElement>(null)

  const query = api.auth.infos.useQuery()

  const mutation = api.auth.profile.update.useMutation({
    onSuccess(_, params) {
      onSuccess?.()
      closeElement.current?.click()

      const authState = useAuthStore.getState().state
      if (!authState) return

      useAuthStore.setState({
        state: {
          ...authState,
          user: {
            ...authState.user,
            ...params.user,
          },
        },
      })
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value

    mutation.mutate({
      user: {
        name,
      },
    })
  }

  return (
    <Sheet {...props}>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update profile</SheetTitle>
          <SheetDescription>
            This will be displayed publicly so be careful what you share.
          </SheetDescription>
        </SheetHeader>
        {match(query)
          .with({ status: 'loading' }, () => <GeneralSkeleton count={4} />)
          .with({ status: 'error' }, () => <GeneralError />)
          .with({ status: 'success' }, (query) => (
            <form className="space-y-4 mt-6" onSubmit={onSubmit}>
              <div className="space-y-1">
                <Input disabled defaultValue={query.data.auth.user.email} />
              </div>

              <div className="space-y-1">
                <Label htmlFor={nameId} className="text-right sr-only">
                  Name
                </Label>
                <Input
                  id={nameId}
                  className="col-span-3"
                  placeholder="Your name"
                  name="name"
                  required
                  minLength={3}
                  defaultValue={query.data.auth.user.name}
                />
              </div>

              <div className="flex justify-end gap-4">
                <SheetClose asChild>
                  <Button ref={closeElement} type="button" variant="secondary" className="flex-1">
                    Close
                  </Button>
                </SheetClose>
                <Button disabled={mutation.isLoading} className="gap-2 flex-1">
                  Submit
                  <MutationStatusIcon status={mutation.status} />
                </Button>
              </div>
            </form>
          ))
          .exhaustive()}
      </SheetContent>
    </Sheet>
  )
}
