'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl, uppercaseFirstLetter } from '@web/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useRef } from 'react'
import { match } from 'ts-pattern'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ui/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/ui/avatar'
import { Button } from '@ui/ui/button'
import { GeneralError } from '@ui/ui/general-error'
import { GeneralSkeleton } from '@ui/ui/general-skeleton'
import { MutationStatusIcon } from '@ui/ui/mutation-status-icon'
import { SheetTrigger } from '@ui/ui/sheet'
import { OrganizationMemberInviteSheet } from './organization-member-invite-sheet'

export function OrganizationMembers() {
  const searchParams = useSearchParams()
  const organizationId = z.string().uuid().parse(searchParams.get('id'))

  const query = api.organization.detail.useQuery({
    organizationId,
  })

  return (
    <div className="@container">
      <section className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16  @2xl:grid-cols-3 ">
        <div>
          <h2 className="font-semibold leading-7">Organization Members</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">These are the members of your organization.</p>
        </div>

        <div className="@2xl:col-span-2 sm:max-w-xl">
          {match(query)
            .with({ status: 'loading' }, () => <GeneralSkeleton count={4} />)
            .with({ status: 'error' }, () => <GeneralError />)
            .with({ status: 'success' }, (query) => (
              <ul role="list" className="divide-y border-t text-sm leading-6">
                {query.data.organization.members.map((member) => {
                  return (
                    <li key={member.userId} className="flex justify-between gap-x-6 py-6">
                      <div className="flex gap-3 items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage alt={member.user.name} src={constructPublicResourceUrl(member.user.avatarUrl)} />
                          <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm">
                            {member.user.name}
                            <span className="ml-1 font-medium text-xs  bg-primary text-primary-foreground px-1 py-0.5 rounded-md">
                              {uppercaseFirstLetter(member.role)}
                            </span>
                          </span>
                          <span className="font-medium text-xs text-muted-foreground">{member.user.email}</span>
                        </div>
                      </div>
                      {/* TODO: not show on yourself */}
                      <MemberRemoveButton organizationId={organizationId} userId={member.userId} />
                    </li>
                  )
                })}

                <li className="flex justify-between gap-x-6 py-6">
                  <MemberInviteButton organizationId={organizationId} />
                </li>
              </ul>
            ))
            .exhaustive()}
        </div>
      </section>
    </div>
  )
}

export function MemberRemoveButton(props: { organizationId: string; userId: string }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const mutation = api.organization.member.remove.useMutation({
    onSettled() {
      closeRef.current?.click()
    },
  })

  const action = () => {
    mutation.mutate({
      organizationId: props.organizationId,
      userId: props.userId,
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={'ghost'} className="text-destructive hover:text-destructive">
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action will remove the member from your organization.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={closeRef}>Cancel</AlertDialogCancel>
          <Button variant={'destructive'} onClick={action} className="gap-2">
            Continue
            <MutationStatusIcon status={mutation.status} />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function MemberInviteButton(props: { organizationId: string }) {
  return (
    <OrganizationMemberInviteSheet organizationId={props.organizationId}>
      <SheetTrigger asChild>
        <Button type="button" variant={'ghost'} className="gap-2">
          <PlusIcon className="w-4 h-4" />
          Invite Member
        </Button>
      </SheetTrigger>
    </OrganizationMemberInviteSheet>
  )
}
