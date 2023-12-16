import type { ApiOutputs } from '@web/lib/api'
import { api } from '@web/lib/api'
import { useId, useRef } from 'react'
import { z } from 'zod'
import { Button } from '@ui/ui/button'
import { Input } from '@ui/ui/input'
import { Label } from '@ui/ui/label'
import { MutationStatusIcon } from '@ui/ui/mutation-status-icon'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@ui/ui/sheet'

type Props = React.ComponentPropsWithoutRef<typeof Sheet> & {
  organizationId: string
  onSuccess?: (result: ApiOutputs['organization']['member']['invite']) => void
}

export function OrganizationMemberInviteSheet({ organizationId, children, onSuccess, ...props }: Props) {
  const emailId = useId()
  const closeElement = useRef<HTMLButtonElement>(null)

  const mutation = api.organization.member.invite.useMutation({
    onSuccess(data) {
      onSuccess?.(data)
      closeElement.current?.click()
    },
  })

  const action = (formData: FormData) => {
    const data = z
      .object({
        email: z.string().email(),
      })
      .parse(Object.fromEntries(formData))

    mutation.mutate({
      organizationId,
      email: data.email,
    })
  }

  return (
    <Sheet {...props}>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite Member to Organization</SheetTitle>
          <SheetDescription>
            We will send an email containing a link to join the organization to the email address you provide.
          </SheetDescription>
        </SheetHeader>
        <form action={action} className="space-y-4 mt-6">
          <div className="space-y-1">
            <Label htmlFor={emailId} className="text-right">
              Email
            </Label>
            <Input id={emailId} className="col-span-3" placeholder="Member email" name="email" type="email" required />
          </div>

          <div className="flex justify-end gap-4">
            <SheetClose asChild>
              <Button ref={closeElement} type="button" variant="secondary">
                Close
              </Button>
            </SheetClose>
            <Button disabled={mutation.isLoading} className="gap-2">
              Submit
              <MutationStatusIcon status={mutation.status} />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
