'use client'

import { organizationInvitationSelectSchema } from '@api/database/schema'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/utils'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { match } from 'ts-pattern'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/ui/avatar'
import { Button } from '@ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/ui/card'
import { GeneralError } from '@ui/ui/general-error'
import { GeneralSkeleton } from '@ui/ui/general-skeleton'
import { MutationStatusIcon } from '@ui/ui/mutation-status-icon'

export function InvitationCard() {
  const searchParams = useSearchParams()
  const invitationSecretKey = organizationInvitationSelectSchema.shape.secretKey.parse(searchParams.get('secret-key'))
  const query = api.organization.member.invitationInfo.useQuery({
    invitationSecretKey,
  })

  return (
    <div className="max-w-lg">
      {match(query)
        .with({ status: 'loading' }, () => (
          <Card>
            <CardContent className="w-72 p-4">
              <GeneralSkeleton count={4} />
            </CardContent>
          </Card>
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
              <p className="text-center text-muted-foreground">{query.data.invitation.organization.name}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <p className="text-center text-muted-foreground">
                You have been invited to join our organization. Click the button below to accept the invitation.
              </p>
              <InvitationAcceptButton invitationSecretKey={invitationSecretKey} />
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        ))
        .exhaustive()}
    </div>
  )
}

export function InvitationAcceptButton(props: { invitationSecretKey: string }) {
  const router = useRouter()
  const mutation = api.organization.member.acceptInvitation.useMutation({
    onSuccess() {
      router.push('/dash')
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
