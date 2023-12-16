'use client'

import { api } from '@web/lib/api'
import { constructPublicResourceUrl, uppercaseFirstLetter } from '@web/lib/utils'
import { useSearchParams } from 'next/navigation'
import { match } from 'ts-pattern'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ui/ui/alert-dialog'
import { Button } from '@ui/ui/button'
import { GeneralError } from '@ui/ui/general-error'
import { GeneralSkeleton } from '@ui/ui/general-skeleton'

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
                        <img src={constructPublicResourceUrl(member.user.avatarUrl)} className="h-9 w-9 rounded-md" />
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
                      <MemberRemoveButton userId={member.userId} />
                    </li>
                  )
                })}
              </ul>
            ))
            .exhaustive()}
        </div>
      </section>
    </div>
  )
}

export function MemberRemoveButton(props: { userId: string }) {
  const action = () => {
    // TODO: implement logic
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={'destructive'} asChild>
            <AlertDialogAction onClick={() => action()}>Continue</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
