import { uppercaseFirstLetter } from '@api/lib/utils'
import { AlertDialogTrigger } from '@ui/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar'
import { Badge } from '@ui/components/ui/badge'
import { SheetTrigger } from '@ui/components/ui/sheet'
import { cn } from '@ui/lib/utils'
import { GeneralError } from '@web/components/general-error'
import { GeneralSkeleton } from '@web/components/general-skeleton'
import { InvitationDeleteAlertDialog } from '@web/components/organization/invitation-delete-alert-dialog'
import { OrganizationMemberInviteSheet } from '@web/components/organization/member-invite-sheet'
import { OrganizationMemberUpdateSheet } from '@web/components/organization/member-update-sheet'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { useAuthedStore } from '@web/stores/auth'
import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { z } from 'zod'

export function Component() {
  const params = z
    .object({
      organizationId: z.string().uuid(),
    })
    .parse(useParams())
  const user = useAuthedStore().session.user

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
                Those are the members can access this organization.
              </p>

              <ul role="list" className="mt-6 divide-y border-t text-sm leading-6">
                {query.data.organization.members.map((member) => (
                  <li
                    key={`members/${member.userId}/${member.organizationId}`}
                    className="flex justify-between gap-x-6 py-6"
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage
                          alt={member.user.name}
                          src={constructPublicResourceUrl(member.user.avatarUrl)}
                        />
                        <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col items-start flex-1 overflow-hidden">
                        <div className="flex items-start gap-1.5">
                          <span className="truncate w-full font-medium">{member.user.name}</span>
                          <Badge variant={'secondary'}>{uppercaseFirstLetter(member.role)}</Badge>
                        </div>
                        <span className="text-muted-foreground font-normal text-xs">
                          {member.user.email}
                        </span>
                      </div>
                    </div>
                    <OrganizationMemberUpdateSheet
                      organizationId={member.organizationId}
                      userId={member.userId}
                    >
                      <SheetTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            'font-semibold text-primary hover:text-primary/80',
                            (organizationMember?.role !== 'admin' ||
                              organizationMember?.userId === member.userId) &&
                              'invisible',
                          )}
                        >
                          Update
                        </button>
                      </SheetTrigger>
                    </OrganizationMemberUpdateSheet>
                  </li>
                ))}
              </ul>

              {organizationMember?.role === 'admin' && (
                <ul role="list" className="mt-6 divide-y border-t text-sm leading-6">
                  {query.data.organization.invitations.map((invitation) => (
                    <li
                      key={`invitations/${invitation.email}`}
                      className="flex justify-between gap-x-6 py-6 flex-wrap gap-2"
                    >
                      <div className="flex items-center gap-1.5 flex-1 justify-start flex-wrap">
                        <span className="truncate font-medium">{invitation.email}</span>
                        <Badge variant={'secondary'}>{uppercaseFirstLetter(invitation.role)}</Badge>
                        <Badge className="shrink-0">Waiting for acceptance</Badge>
                      </div>
                      <InvitationDeleteAlertDialog
                        organizationId={params.organizationId}
                        invitationEmail={invitation.email}
                      >
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              'font-semibold text-destructive hover:text-destructive/80',
                              organizationMember?.role !== 'admin' && 'invisible',
                            )}
                          >
                            Delete
                          </button>
                        </AlertDialogTrigger>
                      </InvitationDeleteAlertDialog>
                    </li>
                  ))}
                </ul>
              )}

              <div
                className={cn(
                  'flex border-t border-border/70 pt-6',
                  organizationMember?.role !== 'admin' && 'invisible',
                )}
              >
                <OrganizationMemberInviteSheet organizationId={params.organizationId}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="text-sm font-semibold leading-6 text-primary hover:text-primary/80"
                    >
                      <span aria-hidden="true">+</span> Add another member
                    </button>
                  </SheetTrigger>
                </OrganizationMemberInviteSheet>
              </div>
            </div>
          </div>
        ))
        .exhaustive()}
    </main>
  )
}
