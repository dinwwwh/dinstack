import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { GeneralError } from '@web/components/general-error'
import { GeneralSkeleton } from '@web/components/general-skeleton'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import { OrganizationDeleteAlertDialog } from '@web/components/organization/delete-alert-dialog'
import { OrganizationLeaveAlertDialog } from '@web/components/organization/leave-alert-dialog'
import { OrganizationUpdateLogoFn } from '@web/components/organization/update-logo-fn'
import { OrganizationUpdateSheet } from '@web/components/organization/update-sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@web/components/ui/avatar'
import { Button } from '@web/components/ui/button'
import { SheetTrigger } from '@web/components/ui/sheet'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { cn } from '@web/lib/utils'
import { useAuthedStore } from '@web/stores/auth'
import { useNavigate, useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { z } from 'zod'

export function Component() {
  const params = z
    .object({
      organizationId: z.string().uuid(),
    })
    .parse(useParams())
  const user = useAuthedStore().session.user
  const navigate = useNavigate()

  const query = api.organization.detail.useQuery({
    organizationId: params.organizationId,
  })

  const organizationMember = query.data?.organization.members.find(
    (member) => member.userId === user.id,
  )

  return (
    <main className="mt-6 md:mt-8 xl:mt-12">
      {match(query)
        .with({ status: 'loading' }, () => <GeneralSkeleton count={6} />)
        .with({ status: 'error' }, () => <GeneralError />)
        .with({ status: 'success' }, (query) => (
          <div className="space-y-16 sm:space-y-20">
            <div>
              <p className="text-sm leading-6 text-muted-foreground">
                This information will be displayed publicly so be careful what you share.
              </p>

              <dl className="mt-6 space-y-6 divide-y border-t text-sm leading-6">
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">ID</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-muted-foreground">{query.data.organization.id}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">Logo</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-foreground">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage
                          alt={query.data.organization.name}
                          src={constructPublicResourceUrl(query.data.organization.logoUrl)}
                        />
                        <AvatarFallback>{query.data.organization.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <OrganizationUpdateLogoFn organizationId={params.organizationId}>
                      {({ mutation, fn }) => (
                        <button
                          type="button"
                          className={cn(
                            'font-semibold text-primary hover:text-primary/80 flex gap-2 items-center disabled:text-primary/60',
                            organizationMember?.role !== 'admin' && 'invisible',
                          )}
                          disabled={mutation.isLoading}
                          onClick={fn}
                        >
                          <MutationStatusIcon status={mutation.status} />
                          Update
                        </button>
                      )}
                    </OrganizationUpdateLogoFn>
                  </dd>
                </div>
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">Name</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-foreground">{query.data.organization.name}</div>
                    <OrganizationUpdateSheet organizationId={params.organizationId}>
                      <SheetTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            'font-semibold text-primary hover:text-primary/80',
                            organizationMember?.role !== 'admin' && 'invisible',
                          )}
                        >
                          Update
                        </button>
                      </SheetTrigger>
                    </OrganizationUpdateSheet>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-destructive/10 p-6 rounded-md">
              <h2 className="text-base font-semibold leading-7 text-destructive">Danger zone</h2>
              <p className="mt-1 text-sm leading-6 text-destructive/80">
                Be careful what you do here.
              </p>

              <div className="mt-6 space-y-6 divide-y border-t text-sm leading-6 divide-destructive/25 border-destructive/25">
                <div className="pt-6 flex items-center justify-between flex-wrap gap-2">
                  <div className="font-medium text-foreground">
                    You will leave &quot;{query.data.organization.name}&quot; organization
                  </div>
                  <OrganizationLeaveAlertDialog
                    organizationId={params.organizationId}
                    onSuccess={() => {
                      navigate('/')
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive">
                        Leave this organization
                      </Button>
                    </AlertDialogTrigger>
                  </OrganizationLeaveAlertDialog>
                </div>
                {organizationMember?.role === 'admin' && (
                  <div className="pt-6 flex items-center justify-between flex-wrap gap-2">
                    <div className="font-medium text-foreground">
                      All data of &quot;{query.data.organization.name}&quot; organization will be
                      deleted
                    </div>
                    <OrganizationDeleteAlertDialog
                      organizationId={params.organizationId}
                      onSuccess={() => {
                        navigate('/')
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                          Delete this organization
                        </Button>
                      </AlertDialogTrigger>
                    </OrganizationDeleteAlertDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
        .exhaustive()}
    </main>
  )
}
