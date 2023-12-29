import { uppercaseFirstLetter } from '@api/lib/utils'
import { GeneralError } from '@web/components/general-error'
import { GeneralSkeleton } from '@web/components/general-skeleton'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import { OrganizationMemberInviteSheet } from '@web/components/organization/member-invite-sheet'
import { OrganizationUpdateLogoFn } from '@web/components/organization/update-logo-fn'
import { OrganizationUpdateSheet } from '@web/components/organization/update-sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@web/components/ui/avatar'
import { Badge } from '@web/components/ui/badge'
import { SheetTrigger } from '@web/components/ui/sheet'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { z } from 'zod'

export function Component() {
  const params = z
    .object({
      organizationId: z.string().uuid(),
    })
    .parse(useParams())

  const query = api.organization.detail.useQuery({
    organizationId: params.organizationId,
  })

  return (
    <div className="mx-auto max-w-5xl py-6 md:py-8 xl:py-12 px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Organization settings</h1>

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
                      <div className="text-muted-foreground">{query.data.organization.id}</div>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex items-center">
                    <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">
                      Logo
                    </dt>
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
                            className="font-semibold text-primary hover:text-primary/80 flex gap-2 items-center disabled:text-primary/60"
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
                    <dt className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">
                      Name
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-foreground">{query.data.organization.name}</div>
                      <OrganizationUpdateSheet organizationId={params.organizationId}>
                        <SheetTrigger asChild>
                          <button
                            type="button"
                            className="font-semibold text-primary hover:text-primary/80"
                          >
                            Update
                          </button>
                        </SheetTrigger>
                      </OrganizationUpdateSheet>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-base font-semibold leading-7 text-foreground">Members</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
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
                      {/* TODO: implement */}
                      <button
                        type="button"
                        className="font-semibold text-primary hover:text-primary/80"
                      >
                        Update
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex border-t border-border/70 pt-6">
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
    </div>
  )
}
