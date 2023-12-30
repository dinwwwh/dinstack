import { GeneralError } from '../general-error'
import { GeneralSkeleton } from '../general-skeleton'
import { MutationStatusIcon } from '../mutation-status-icon'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { organizationMemberSchema } from '@api/database/schema'
import { Button } from '@web/components/ui/button'
import { Input } from '@web/components/ui/input'
import { Label } from '@web/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@web/components/ui/sheet'
import { api } from '@web/lib/api'
import { useId, useRef } from 'react'
import { match } from 'ts-pattern'
import { z } from 'zod'

type Props = React.ComponentPropsWithoutRef<typeof Sheet> & {
  organizationId: string
  userId: string
  onSuccess?: () => void
}

export function OrganizationMemberUpdateSheet({
  organizationId,
  userId,
  children,
  onSuccess,
  ...props
}: Props) {
  const roleAdminId = useId()
  const roleMemberId = useId()
  const closeElement = useRef<HTMLButtonElement>(null)

  const query = api.organization.detail.useQuery({
    organizationId,
  })

  const mutation = api.organization.member.update.useMutation({
    onSuccess() {
      onSuccess?.()
      closeElement.current?.click()
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = z
      .object({
        role: organizationMemberSchema.shape.role,
      })
      .parse(Object.fromEntries(new FormData(e.currentTarget)))

    mutation.mutate({
      organizationId,
      userId,
      memberRole: data.role,
    })
  }

  return (
    <Sheet {...props}>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Member</SheetTitle>
          <SheetDescription>
            Update the member&apos;s role or remove them from the organization.
          </SheetDescription>
        </SheetHeader>

        {match(query)
          .with({ status: 'loading' }, () => <GeneralSkeleton count={4} />)
          .with({ status: 'error' }, () => <GeneralError />)
          .with({ status: 'success' }, (query) => {
            const member = query.data.organization.members.find(
              (member) => member.userId === userId,
            )

            if (!member) {
              throw new Error('Member not found')
            }

            return (
              <form onSubmit={onSubmit} className="space-y-4 mt-6">
                <div className="space-y-1">
                  <Input className="col-span-3" defaultValue={member.user.name} disabled />
                </div>

                <div className="space-y-1">
                  <Input className="col-span-3" defaultValue={member.user.email} disabled />
                </div>

                <RadioGroup defaultValue={member.role} name="role">
                  <div className="items-top flex space-x-2 p-4 rounded-md border">
                    <RadioGroupItem id={roleMemberId} value="member" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={roleMemberId}>Member role</Label>
                      <p className="text-sm text-muted-foreground">
                        Members can view and edit organization resources.
                      </p>
                    </div>
                  </div>

                  <div className="items-top flex space-x-2 p-4 rounded-md border">
                    <RadioGroupItem id={roleAdminId} value="admin" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={roleAdminId}>Admin role</Label>
                      <p className="text-sm text-muted-foreground">
                        Admins can do everything members can, plus manage organization settings and
                        members.
                      </p>
                    </div>
                  </div>
                </RadioGroup>

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

                <MemberRemoveButton
                  organizationId={organizationId}
                  userId={userId}
                  onSuccess={() => {
                    closeElement.current?.click()
                  }}
                />
              </form>
            )
          })
          .exhaustive()}
      </SheetContent>
    </Sheet>
  )
}

function MemberRemoveButton(props: {
  organizationId: string
  userId: string
  onSuccess?: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const mutation = api.organization.member.remove.useMutation({
    onSuccess() {
      cancelRef.current?.click()
      props.onSuccess?.()
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={'destructive'} className="w-full">
          Remove this member
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the member from the
            organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant={'destructive'}
            className="gap-2"
            onClick={() =>
              mutation.mutate({
                organizationId: props.organizationId,
                userId: props.userId,
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
