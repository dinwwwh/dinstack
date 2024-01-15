import { AlertDialogTrigger } from '@ui/components/ui/alert-dialog'
import { GeneralError } from '@web/components/general-error'
import { GeneralSkeleton } from '@web/components/general-skeleton'
import { GoogleLogoColorfulIcon } from '@web/components/icons/google-logo'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import { OauthDisconnectAlertDialog } from '@web/components/profile/oauth-disconnect-alert-dialog'
import { api } from '@web/lib/api'
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
  const query = api.auth.oauth.infos.useQuery()

  return (
    <main className="mt-6 md:mt-8 xl:mt-12">
      {match(query)
        .with({ status: 'loading' }, () => <GeneralSkeleton count={6} />)
        .with({ status: 'error' }, () => <GeneralError />)
        .with({ status: 'success' }, (query) => (
          <div>
            <p className="text-sm leading-6 text-muted-foreground">
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
                            className="font-semibold text-destructive hover:text-destructive/80"
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
        ))
        .exhaustive()}
    </main>
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
      className="font-semibold text-primary hover:text-primary/80 flex gap-2 items-center disabled:text-primary/60"
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
