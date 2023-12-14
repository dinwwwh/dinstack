'use client'

import { api } from '@web/lib/api'
import { useId } from 'react'
import { match } from 'ts-pattern'
import { Button } from '@ui/ui/button'
import { GeneralError } from '@ui/ui/general-error'
import { GeneralSkeleton } from '@ui/ui/general-skeleton'
import { Input } from '@ui/ui/input'
import { Label } from '@ui/ui/label'
import { MutationStatusIcon } from '@ui/ui/mutation-status-icon'

export function PersonalInfosForm() {
  const nameId = useId()
  const emailId = useId()
  const query = api.auth.infos.useQuery()
  const mutation = api.auth.profile.update.useMutation()

  const action = (form: FormData) => {
    const name = form.get('name') as string

    mutation.mutate({ user: { name } })
  }

  return (
    <div className="@container">
      <section className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 @2xl:grid-cols-3">
        <div>
          <h2 className="font-semibold leading-7">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Edit your personal information associated with your account.
          </p>
        </div>

        <div className="@2xl:col-span-2 max-w-xl">
          {match(query)
            .with({ status: 'loading' }, () => <GeneralSkeleton count={5} />)
            .with({ status: 'error' }, () => <GeneralError />)
            .with({ status: 'success' }, (query) => (
              <form action={action}>
                <div className="space-y-8">
                  <div className="flex items-center gap-8">
                    <img
                      src={query.data.session.organizationMember.user.avatarUrl}
                      alt={query.data.session.organizationMember.user.name}
                      className="h-24 w-24 flex-none rounded-lg bg-background object-cover"
                    />
                    <div>
                      {/* TODO: implement */}
                      <Button type="button">Change avatar</Button>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={nameId}>Name</Label>
                    <div className="mt-2">
                      <Input id={nameId} name="name" defaultValue={query.data.session.organizationMember.user.name} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={emailId}>Email</Label>
                    <div className="mt-2">
                      <Input
                        id={emailId}
                        type="email"
                        name="email"
                        disabled
                        defaultValue={query.data.session.organizationMember.user.email}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button disabled={mutation.isLoading} className="gap-2">
                    Save
                    <MutationStatusIcon status={mutation.status} />
                  </Button>
                </div>
              </form>
            ))
            .exhaustive()}
        </div>
      </section>
    </div>
  )
}
