'use client'

import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { api } from '@web/lib/api'
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
  const query = api.auth.infos.useQuery()

  const connectOauth = (provider: string) => () => {
    // TODO: implement
  }

  const disconnectOauth = (provider: string) => () => {
    // TODO: implement
  }

  return (
    <div className="@container">
      <section className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16  @2xl:grid-cols-3 ">
        <div>
          <h2 className="font-semibold leading-7">Account Connections</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Manage your account connections.</p>
        </div>

        <div className="@2xl:col-span-2 sm:max-w-xl">
          {match(query)
            .with({ status: 'loading' }, () => <GeneralSkeleton count={oauthProviders.length * 1.5} />)
            .with({ status: 'error' }, () => <GeneralError />)
            .with({ status: 'success' }, (query) => (
              <ul role="list" className="divide-y border-t text-sm leading-6">
                {oauthProviders.map((provider) => (
                  <li className="flex justify-between gap-x-6 py-6">
                    <div className="font-medium flex gap-3 items-center">
                      <provider.Icon className="h-6 w-6 " />
                      <span>{provider.name}</span>
                    </div>
                    {query.data.oauthAccounts.some((account) => account.provider === provider.provider) ? (
                      <Button
                        type="button"
                        variant={'ghost'}
                        className="text-destructive hover:text-destructive"
                        onClick={() => disconnectOauth(provider.provider)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button type="button" variant={'ghost'} onClick={() => connectOauth(provider.provider)}>
                        Connect
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ))
            .exhaustive()}
        </div>
      </section>
    </div>
  )
}
