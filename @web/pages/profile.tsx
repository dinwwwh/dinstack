import { GeneralError } from '@web/components/general-error'
import { GeneralSkeleton } from '@web/components/general-skeleton'
import { GoogleLogoColorfulIcon } from '@web/components/icons/google-logo'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import { OauthDisconnectAlertDialog } from '@web/components/profile/oauth-disconnect-alert-dialog'
import { ProfileUpdateLogoFn } from '@web/components/profile/update-logo-fn'
import { ProfileUpdateSheet } from '@web/components/profile/update-sheet'
import { AlertDialogTrigger } from '@web/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@web/components/ui/avatar'
import { SheetTrigger } from '@web/components/ui/sheet'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { cn } from '@web/lib/utils'
import { useAuthStore } from '@web/stores/auth'
import { GithubIcon } from 'lucide-react'
import { match } from 'ts-pattern'

const oauthProviders = [
  {
    Icon: GoogleLogoColorfulIcon,
    name: 'Google',
    provider: 'google',
  },
  {
    Icon: GithubIcon,
    name: 'GitHub',
    provider: 'github',
  },
] as const

export function Component() {
  const query = api.auth.infos.useQuery()

  return (
    <div className="mx-auto max-w-5xl py-6 md:py-8 xl:py-12 px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>

      <main className="mt-8 md:mt-10 xl:mt-14">
        {match(query)
          .with({ status: 'loading' }, () => <GeneralSkeleton count={6} />)
          .with({ status: 'error' }, () => <GeneralError />)
          .with({ status: 'success' }, (query) => (
            <div className="space-y-16 sm:space-y-20">
              <div>
                <h2 className="text-base font-semibold leading-7 text-foreground">General</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This information will be displayed publicly so be careful what you share.
                </p>

                <dl className="mt-6 space-y-6 divide-y border-t text-sm leading-6">
                  <div className="pt-6 sm:flex items-center">
                    <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">ID</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-muted-foreground">{query.data.session.userId}</div>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex items-center">
                    <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">
                      Email
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-muted-foreground">{query.data.session.user.email}</div>
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
                            alt={query.data.session.user.name}
                            src={constructPublicResourceUrl(query.data.session.user.avatarUrl)}
                          />
                          <AvatarFallback>{query.data.session.user.name[0]}</AvatarFallback>
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
                    <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">
                      Name
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-foreground">{query.data.session.user.name}</div>
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

              <div>
                <h2 className="text-base font-semibold leading-7 text-foreground">
                  Connected accounts
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Those accounts can be used to sign in to your account.
                </p>

                <ul role="list" className="mt-6 divide-y border-t text-sm leading-6">
                  {oauthProviders.map((provider) => {
                    const oauthAccount = query.data.oauthAccounts.find(
                      (account) => account.provider === provider.provider,
                    )

                    return (
                      <li key={provider.provider} className="flex justify-between gap-x-6 py-6">
                        <div className="flex gap-2 items-center">
                          <provider.Icon className="h-9 w-9 flex-shrink-0" />

                          <div className="flex flex-col items-start flex-1 overflow-hidden">
                            <span className="truncate w-full font-medium">{provider.name}</span>
                            <span className="text-muted-foreground font-normal text-xs">
                              {oauthAccount?.identifier}
                            </span>
                          </div>
                        </div>
                        {oauthAccount ? (
                          <OauthDisconnectAlertDialog provider={provider.provider}>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  'font-semibold text-destructive hover:text-destructive/80',
                                )}
                              >
                                Disconnect
                              </button>
                            </AlertDialogTrigger>
                          </OauthDisconnectAlertDialog>
                        ) : (
                          <OauthConnectButton provider={provider.provider} />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))
          .exhaustive()}
      </main>
    </div>
  )
}

function OauthConnectButton(props: { provider: (typeof oauthProviders)[number]['provider'] }) {
  const authorizationUrlMutation = api.auth.oauth.authorizationUrl.useMutation({
    onSuccess(data) {
      useAuthStore.setState({
        oauthAuthorization: {
          codeVerifier: data.codeVerifier,
          state: data.state,
          redirectUrl: new URL(window.location.href),
        },
      })
      window.location.href = data.url.toString()
    },
  })

  return (
    <button
      type="button"
      className={cn(
        'font-semibold text-primary hover:text-primary/80 flex gap-2 items-center disabled:text-primary/60',
      )}
      disabled={
        authorizationUrlMutation.isLoading &&
        authorizationUrlMutation.variables?.provider === props.provider
      }
      onClick={() => authorizationUrlMutation.mutate({ provider: props.provider })}
    >
      <MutationStatusIcon status={authorizationUrlMutation.status} /> Connect
    </button>
  )
}
