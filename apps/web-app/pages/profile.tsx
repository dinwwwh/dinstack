import { OauthConnections } from '@auth-react/components/oauth-connections'
import { PersonalInfosForm } from '@auth-react/components/personal-infos-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/ui/card'
import { constructPublicResourceUrl } from '@web-app/lib/utils'

export function Component() {
  return (
    <div className="">
      <div className="max-w-3xl p-4 mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfosForm constructPublicResourceUrl={constructPublicResourceUrl} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              These are the accounts that can be used to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OauthConnections />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
