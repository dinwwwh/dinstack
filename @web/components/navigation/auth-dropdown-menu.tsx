import { MutationStatusIcon } from '../mutation-status-icon'
import { ViewportBlock } from '../viewport-block'
import { useClerk, useOrganization, useOrganizationList } from '@clerk/clerk-react'
import { Avatar, AvatarFallback, AvatarImage } from '@web/components/ui/avatar'
import { Button } from '@web/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@web/components/ui/dropdown-menu'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { SheetTrigger } from '@web/components/ui/sheet'
import { Skeleton } from '@web/components/ui/skeleton'
import { useAuthed } from '@web/lib/auth'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { trpc } from '@web/lib/trpc'
import { ChevronRightIcon, LogOutIcon, PlusIcon, SettingsIcon, UserRoundIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

type Props = React.ComponentPropsWithoutRef<typeof DropdownMenu>
type OrganizationResource = Exclude<
  ReturnType<typeof useOrganization>['organization'],
  null | undefined
>

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
        <OrganizationList onOpenChange={_onOpenChange} />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ProfileDropdownMenuItem setOpen={_onOpenChange} />
          <CreateOrganizationDropdownMenuItem setOpen={_onOpenChange} />
          <SignOutDropdownMenuItem setOpen={_onOpenChange} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function OrganizationList({ onOpenChange }: { onOpenChange: (v: boolean) => void }) {
  const { userMemberships, isLoaded } = useOrganizationList()

  console.log({ userMemberships })

  return (
    <DropdownMenuGroup>
      <ScrollArea
        style={{
          height: (userMemberships.count ?? 0) > 4 ? '200px' : 'auto',
        }}
      >
        <div className="space-y-2 py-2">
          {match(isLoaded)
            .with(false, () => <OrganizationListItemSkeleton />)
            .with(true, () => {
              return (
                <>
                  {userMemberships.data?.map((member) => (
                    <OrganizationListItem
                      key={member.organization.id}
                      organization={member.organization}
                      onSuccess={() => onOpenChange(false)}
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
      <Skeleton className="h-9 w-9" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

function OrganizationListItem(props: {
  organization: OrganizationResource
  onSuccess?: () => void
  disabled?: boolean
}) {
  const clerk = useClerk()

  return (
    <div className="flex gap-2 pl-2">
      <Button
        type="button"
        className="flex-1 justify-start gap-2"
        size={'icon'}
        variant={'ghost'}
        onClick={() => {
          clerk.setActive({
            organization: props.organization.id,
          })
        }}
      >
        <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt={props.organization.name}
              src={constructPublicResourceUrl(props.organization.imageUrl)}
            />
            <AvatarFallback>{props.organization.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col items-start flex-1 overflow-hidden">
          <span className="truncate w-full text-left font-medium">{props.organization.name}</span>
          <span className="text-muted-foreground font-normal text-xs">{`${
            props.organization.membersCount
          } ${props.organization.membersCount === 1 ? 'member' : 'members'}`}</span>
        </div>
      </Button>

      <Button variant={'ghost'} size={'icon'} className="w-8" onClick={() => props.onSuccess?.()}>
        <SettingsIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

function SignOutDropdownMenuItem(props: DropdownMenuItemProps) {
  const auth = useAuthed()
  const [logoutStatus, setSignOutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )

  return (
    <Button
      type="button"
      variant={'ghost'}
      size={'default'}
      className="w-full justify-start font-normal px-2 gap-2"
      onClick={() => {
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
    >
      <MutationStatusIcon status={logoutStatus}>
        <LogOutIcon className="h-4 w-4" />
      </MutationStatusIcon>
      Sign Out
    </Button>
  )
}

function CreateOrganizationDropdownMenuItem(props: DropdownMenuItemProps) {
  const clerk = useClerk()

  return (
    <Button
      type="button"
      variant={'ghost'}
      size={'default'}
      className="w-full justify-start font-normal px-2"
      onClick={() => {
        clerk.openCreateOrganization()
        props.setOpen(false)
      }}
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      Create Organization
    </Button>
  )
}

function ProfileDropdownMenuItem(props: DropdownMenuItemProps) {
  const clerk = useClerk()

  return (
    <Button
      type="button"
      variant={'ghost'}
      size={'default'}
      className="w-full justify-start font-normal px-2"
      onClick={() => {
        clerk.openUserProfile()
        props.setOpen(false)
      }}
    >
      <UserRoundIcon className="h-4 w-4 mr-2" />
      Profile
    </Button>
  )
}
