import { MutationStatusIcon } from '../mutation-status-icon'
import { Badge } from '../ui/badge'
import { ViewportBlock } from '../viewport-block'
import type { useOrganization } from '@clerk/clerk-react'
import { useClerk, useOrganizationList } from '@clerk/clerk-react'
import { Avatar, AvatarFallback, AvatarImage } from '@web/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@web/components/ui/dropdown-menu'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { Skeleton } from '@web/components/ui/skeleton'
import { useAuthed, useAuthedUser } from '@web/lib/auth'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { ArrowDownUpIcon, LogOutIcon, PlusIcon, SettingsIcon, UserRoundIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { match } from 'ts-pattern'

type Props = React.ComponentPropsWithoutRef<typeof DropdownMenu>
type OrganizationResource = Exclude<
  ReturnType<typeof useOrganization>['organization'],
  null | undefined
>
type UserResource = ReturnType<typeof useAuthedUser>['user']

type DropdownMenuItemProps = {
  setOpen: (open: boolean) => void
}

export function AuthDropdownMenu({ children, open = false, onOpenChange, ...props }: Props) {
  const [_open, _setOpen] = useState(open)

  useEffect(() => {
    _setOpen(open)
  }, [open])

  const _onOpenChange = (v: boolean) => {
    _setOpen(v)
    onOpenChange?.(v)
  }

  return (
    <DropdownMenu open={_open} onOpenChange={_onOpenChange} {...props}>
      {children}
      <DropdownMenuContent className="w-72">
        <OrganizationList setOpen={_onOpenChange} />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <CreateOrganizationDropdownMenuItem />
          <ProfileDropdownMenuItem />
          <SignOutDropdownMenuItem setOpen={_onOpenChange} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function OrganizationList(props: DropdownMenuItemProps) {
  const clerkUser = useAuthedUser()
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      pageSize: 10,
      infinite: true,
    },
  })

  return (
    <DropdownMenuGroup>
      <ScrollArea
        style={{
          height: (userMemberships.count ?? 0) > 8 ? '400px' : 'auto',
        }}
      >
        <div className="space-y-2 py-2">
          <OrganizationListItem type="user" user={clerkUser.user} {...props} />

          {match(userMemberships)
            .with({ isLoading: true }, () => <OrganizationListItemSkeleton />)
            .with({ isLoading: false }, (userMemberships) => {
              return (
                <>
                  {userMemberships.data?.map((member) => (
                    <OrganizationListItem
                      key={member.organization.id}
                      type="organization"
                      organization={member.organization}
                      {...props}
                    />
                  ))}

                  {!userMemberships.isFetching && userMemberships.hasNextPage && (
                    <ViewportBlock onEnterViewport={() => userMemberships.fetchNext()} />
                  )}
                  {userMemberships.hasNextPage && <OrganizationListItemSkeleton />}
                </>
              )
            })
            .exhaustive()}
        </div>
      </ScrollArea>
    </DropdownMenuGroup>
  )
}

function OrganizationListItemSkeleton() {
  return (
    <div className="flex gap-2 pl-2">
      <Skeleton className="size-9 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

function OrganizationListItem(
  props: DropdownMenuItemProps &
    (
      | {
          type: 'organization'
          organization: OrganizationResource
        }
      | {
          type: 'user'
          user: UserResource
        }
    ),
) {
  const [activeStatus, setActiveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const auth = useAuthed()
  const clerk = useClerk()

  const isActive = match(props)
    .with({ type: 'organization' }, (props) => auth.orgId === props.organization.id)
    .with({ type: 'user' }, () => !auth.orgId)
    .exhaustive()

  const imageUrl = match(props)
    .with({ type: 'organization' }, (props) => props.organization.imageUrl)
    .with({ type: 'user' }, (props) => props.user.imageUrl)
    .exhaustive()

  const name =
    match(props)
      .with({ type: 'organization' }, (props) => props.organization.name)
      .with({ type: 'user' }, (props) => props.user.fullName)
      .exhaustive() || ''

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault()

        if (isActive) {
          clerk.openOrganizationProfile()
          props.setOpen(false)
        } else {
          setActiveStatus('loading')
          clerk
            .setActive({
              organization: match(props)
                .with({ type: 'organization' }, (props) => props.organization.id)
                .with({ type: 'user' }, () => null)
                .exhaustive(),
            })
            .then(() => {
              setActiveStatus('success')
            })
            .catch(() => {
              setActiveStatus('error')
            })
            .finally(() => {
              props.setOpen(false)
            })
        }
      }}
      className="flex-1 justify-start gap-2 pr-2.5 w-full group"
      disabled={isActive && props.type === 'user'}
      asChild
    >
      <button type="button">
        <div className="size-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <MutationStatusIcon status={activeStatus} className="text-muted-foreground">
            <Avatar className="size-9">
              <AvatarImage alt={name} src={constructPublicResourceUrl(imageUrl)} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </MutationStatusIcon>
        </div>

        <div className="flex flex-col items-start flex-1 overflow-hidden">
          <div className=" w-full flex items-center">
            <span className="shrink truncate font-medium">{name}</span>
            {isActive && (
              <Badge className="ml-2 px-1 py-0 shrink-0" variant={'default'}>
                Current
              </Badge>
            )}
          </div>
          <span className="text-muted-foreground font-normal text-xs">
            {match(props)
              .with(
                { type: 'organization' },
                (props) =>
                  `${props.organization.membersCount} ${
                    props.organization.membersCount === 1 ? 'member' : 'members'
                  }`,
              )
              .with({ type: 'user' }, () => 'Personal Only')
              .exhaustive()}
          </span>
        </div>
        {isActive ? (
          props.type === 'organization' && (
            <SettingsIcon className="size-4 text-muted-foreground group-hover:text-foreground" />
          )
        ) : (
          <ArrowDownUpIcon className="size-4 text-muted-foreground group-hover:text-foreground" />
        )}
      </button>
    </DropdownMenuItem>
  )
}

function SignOutDropdownMenuItem(props: DropdownMenuItemProps) {
  const auth = useAuthed()
  const [logoutStatus, setSignOutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault()

        setSignOutStatus('loading')
        auth
          .signOut()
          .then(() => {
            setSignOutStatus('success')
          })
          .catch(() => {
            setSignOutStatus('error')
          })
          .finally(() => {
            props.setOpen(false)
          })
      }}
      className="gap-2 w-full h-9"
      asChild
    >
      <button type="button">
        <MutationStatusIcon status={logoutStatus}>
          <LogOutIcon className="size-4" />
        </MutationStatusIcon>
        Sign Out
      </button>
    </DropdownMenuItem>
  )
}

function CreateOrganizationDropdownMenuItem() {
  const clerk = useClerk()

  return (
    <DropdownMenuItem
      onClick={() => {
        clerk.openCreateOrganization()
      }}
      className="w-full gap-2 h-9"
      asChild
    >
      <button type="button">
        <PlusIcon className="size-4" />
        Create Organization
      </button>
    </DropdownMenuItem>
  )
}

function ProfileDropdownMenuItem() {
  const clerk = useClerk()

  return (
    <DropdownMenuItem
      className="w-full gap-2 h-9"
      onClick={() => {
        clerk.openUserProfile()
      }}
      asChild
    >
      <button type="button">
        <UserRoundIcon className="size-4" />
        Profile
      </button>
    </DropdownMenuItem>
  )
}
