import { MutationStatusIcon } from '../mutation-status-icon'
import { Button } from '@ui/components/ui/button'
import { Checkbox } from '@ui/components/ui/checkbox'
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
import type { ApiOutputs } from '@web/lib/api'
import { api } from '@web/lib/api'
import { useId, useRef } from 'react'
import { z } from 'zod'

type Props = React.ComponentPropsWithoutRef<typeof Sheet> & {
  organizationId: string
  onSuccess?: (result: ApiOutputs['organization']['member']['invite']) => void
}

export function OrganizationMemberInviteSheet({
  organizationId,
  children,
  onSuccess,
  ...props
}: Props) {
  const emailId = useId()
  const withAdminRoleId = useId()
  const closeElement = useRef<HTMLButtonElement>(null)

  const mutation = api.organization.member.invite.useMutation({
    onSuccess(data) {
      onSuccess?.(data)
      closeElement.current?.click()
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = z
      .object({
        email: z.string().email(),
        withAdminRole: z
          .enum(['on'])
          .optional()
          .transform((value) => value === 'on'),
      })
      .parse(Object.fromEntries(new FormData(e.currentTarget)))

    mutation.mutate({
      organizationId,
      email: data.email,
      role: data.withAdminRole ? 'admin' : 'member',
    })
  }

  return (
    <Sheet {...props}>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite Member to Organization</SheetTitle>
          <SheetDescription>
            We will send an email containing a link to join the organization to the email address
            you provide.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <div className="space-y-1">
            <Label htmlFor={emailId} className="text-right">
              Email
            </Label>
            <Input
              id={emailId}
              className="col-span-3"
              placeholder="Member email"
              name="email"
              type="email"
              required
            />
          </div>

          <div className="items-top flex space-x-2 p-4 rounded-md border">
            <Checkbox id={withAdminRoleId} name="withAdminRole" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={withAdminRoleId}>Give admin role</Label>
              <p className="text-sm text-muted-foreground">
                Admins can do everything members can, plus manage organization settings and members.
              </p>
            </div>
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
      </SheetContent>
    </Sheet>
  )
}
