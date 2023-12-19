'use client'

import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { api } from '@web/lib/api'
import { oauthStateAtom } from '@web/services/auth/atoms'
import { useAtom } from 'jotai'
import { match } from 'ts-pattern'
import { GoogleLogoColorfulIcon } from '@ui/icons/google-logo'
import { Button } from '@ui/ui/button'
import { GeneralError } from '@ui/ui/general-error'
import { GeneralSkeleton } from '@ui/ui/general-skeleton'

const oauthProviders = [
  {
    Icon: GoogleLogoColorfulIcon,
    name: 'Google',
    provider: 'google',
  },
  {
    Icon: GitHubLogoIcon,
    name: 'GitHub',
    provider: 'github',
  },
] as const

export function OauthConnections() {
  const [, setSate] = useAtom(oauthStateAtom)

  const query = api.auth.infos.useQuery()
  const disconnectMutation = api.auth.oauth.disconnect.useMutation()
  const authorizationUrlMutation = api.auth.oauth.authorizationUrl.useMutation({
    onSuccess(data) {
      setSate({
        state: data.state,
        codeVerifier: data.codeVerifier,
        authorizationRedirectUrl: window.location.href,
      })
      window.location.href = data.url.toString()
    },
  })

  return (
    <div className="@container">
      <section className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16  @2xl:grid-cols-3 ">
        <div>
          <h2 className="font-semibold leading-7">Account Connections</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            These are the accounts that can be used to login to your account.
          </p>
        </div>

        <div className="@2xl:col-span-2 sm:max-w-xl">
          {match(query)
            .with({ status: 'loading' }, () => <GeneralSkeleton count={oauthProviders.length * 1.5} />)
            .with({ status: 'error' }, () => <GeneralError />)
            .with({ status: 'success' }, (query) => (
              <ul role="list" className="divide-y border-t text-sm leading-6">
                {oauthProviders.map((provider) => {
                  const oauthAccount = query.data.oauthAccounts.find(
                    (account) => account.provider === provider.provider,
                  )

                  return (
                    <li key={provider.provider} className="flex justify-between gap-x-6 py-6">
                      <div className="flex gap-3 items-center">
                        <provider.Icon className="h-9 w-9 " />
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm">{provider.name}</span>
                          <span className="font-medium text-xs text-muted-foreground">{oauthAccount?.identifier}</span>
                        </div>
                      </div>
                      {oauthAccount ? (
                        <Button
                          type="button"
                          variant={'ghost'}
                          className="text-destructive hover:text-destructive"
                          disabled={
                            disconnectMutation.isLoading && disconnectMutation.variables?.provider === provider.provider
                          }
                          onClick={() =>
                            disconnectMutation.mutate({
                              provider: provider.provider,
                            })
                          }
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant={'ghost'}
                          disabled={
                            authorizationUrlMutation.isLoading &&
                            authorizationUrlMutation.variables?.provider === provider.provider
                          }
                          onClick={() => authorizationUrlMutation.mutate({ provider: provider.provider })}
                        >
                          Connect
                        </Button>
                      )}
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
