import { AlertDialogTrigger } from '@ui/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar'
import { Button } from '@ui/components/ui/button'
import { SheetTrigger } from '@ui/components/ui/sheet'
import { cn } from '@ui/lib/utils'
import { LogoutOtherDevicesAlertDialog } from '@web/components/auth/logout-other-devices-alert-dialog'
import { GeneralError } from '@web/components/general-error'
import { GeneralSkeleton } from '@web/components/general-skeleton'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import { ProfileUpdateLogoFn } from '@web/components/profile/update-logo-fn'
import { ProfileUpdateSheet } from '@web/components/profile/update-sheet'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { match } from 'ts-pattern'

export function Component() {
  const query = api.auth.infos.useQuery()

  return (
    <main className="mt-6 md:mt-8 xl:mt-12">
      {match(query)
        .with({ status: 'loading' }, () => <GeneralSkeleton count={6} />)
        .with({ status: 'error' }, () => <GeneralError />)
        .with({ status: 'success' }, (query) => (
          <div className="space-y-16 sm:space-y-20">
            <div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This information will be displayed publicly so be careful what you share.
              </p>

              <dl className="mt-6 space-y-6 divide-y border-t text-sm leading-6">
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">ID</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-muted-foreground">{query.data.auth.userId}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">
                    Email
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-muted-foreground">{query.data.auth.user.email}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">
                    Avatar
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-foreground">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage
                          alt={query.data.auth.user.name}
                          src={constructPublicResourceUrl(query.data.auth.user.avatarUrl)}
                        />
                        <AvatarFallback>{query.data.auth.user.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <ProfileUpdateLogoFn>
                      {({ mutation, fn }) => (
                        <button
                          type="button"
                          className={cn(
                            'font-semibold text-primary hover:text-primary/80 flex gap-2 items-center disabled:text-primary/60',
                          )}
                          disabled={mutation.isLoading}
                          onClick={fn}
                        >
                          <MutationStatusIcon status={mutation.status} />
                          Update
                        </button>
                      )}
                    </ProfileUpdateLogoFn>
                  </dd>
                </div>
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">Name</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-foreground">{query.data.auth.user.name}</div>
                    <ProfileUpdateSheet>
                      <SheetTrigger asChild>
                        <button
                          type="button"
                          className={cn('font-semibold text-primary hover:text-primary/80')}
                        >
                          Update
                        </button>
                      </SheetTrigger>
                    </ProfileUpdateSheet>
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
                    You will be logged out from all other devices (except this one)
                  </div>
                  <LogoutOtherDevicesAlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive">
                        Logout from all other devices
                      </Button>
                    </AlertDialogTrigger>
                  </LogoutOtherDevicesAlertDialog>
                </div>
              </div>
            </div>
          </div>
        ))
        .exhaustive()}
    </main>
  )
}
