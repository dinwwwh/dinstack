import { organizationInvitationSchema } from '@api/database/schema'
import { GeneralError } from '@web/components/general-error'
import { GeneralSkeleton } from '@web/components/general-skeleton'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import { Avatar, AvatarFallback, AvatarImage } from '@web/components/ui/avatar'
import { Button } from '@web/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@web/components/ui/card'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { match } from 'ts-pattern'

export function Component() {
  const params = organizationInvitationSchema.pick({ secretKey: true }).parse(useParams())
  const query = api.organization.member.invitationInfo.useQuery({
    invitationSecretKey: params.secretKey,
  })

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-lg">
        {match(query)
          .with({ status: 'loading' }, () => (
            <div className="w-96 p-4">
              <GeneralSkeleton count={4} />
            </div>
          ))
          .with({ status: 'error' }, () => <GeneralError className="w-72" />)
          .with({ status: 'success' }, (query) => (
            <Card className="max-w-md w-full space-y-4">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    alt={query.data.invitation.organization.name}
                    src={constructPublicResourceUrl(query.data.invitation.organization.logoUrl)}
                  />
                  <AvatarFallback>{query.data.invitation.organization.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>Join Our Organization</CardTitle>
                <p className="text-center text-muted-foreground">
                  {query.data.invitation.organization.name}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <p className="text-center text-muted-foreground">
                  You have been invited to join our organization. Click the button below to accept
                  the invitation.
                </p>
                <InvitationAcceptButton invitationSecretKey={params.secretKey} />
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </CardContent>
            </Card>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}

export function InvitationAcceptButton(props: { invitationSecretKey: string }) {
  const navigate = useNavigate()
  const mutation = api.organization.member.acceptInvitation.useMutation({
    onSuccess() {
      navigate('/')
    },
  })

  return (
    <Button
      type="button"
      className="w-full gap-2"
      onClick={() =>
        mutation.mutate({
          invitationSecretKey: props.invitationSecretKey,
        })
      }
    >
      Accept Invitation
      <MutationStatusIcon status={mutation.status} />
    </Button>
  )
}
