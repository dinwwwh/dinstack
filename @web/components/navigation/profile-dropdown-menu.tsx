import { MutationStatusIcon } from '../mutation-status-icon'
import { OrganizationCreateSheet } from '../organization/create-sheet'
import { ViewportBlock } from '../viewport-block'
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
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { useAuthStore, useAuthedStore } from '@web/stores/auth'
import { ChevronRightIcon, LogOutIcon, PlusIcon, UserRoundIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

type Props = React.ComponentPropsWithoutRef<typeof DropdownMenu>

export function ProfileDropdownMenu({ children, open = false, onOpenChange, ...props }: Props) {
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
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link to="/profile">
              <UserRoundIcon className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <CreateOrganizationDropdownMenuItem />
          <LogoutDropdownMenuItem />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function OrganizationList({ onOpenChange }: { onOpenChange: (v: boolean) => void }) {
  const organization = useAuthedStore().session.organization
  const listQuery = api.organization.list.useInfiniteQuery(
    {
      limit: 6,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  return (
    <DropdownMenuGroup>
      <ScrollArea
        style={{
          height: (listQuery.data?.pages[0]?.items.length ?? 0) > 4 ? '200px' : 'auto',
        }}
      >
        <div className="space-y-2 py-2">
          <OrganizationListItem
            organization={{
              ...organization,
              numberMembers: organization.members.length,
            }}
            disabled
            onSuccess={() => onOpenChange(false)}
          />

          {match(listQuery)
            .with({ status: 'loading' }, () => <OrganizationListItemSkeleton />)
            .with({ status: 'error' }, () => '')
            .with({ status: 'success' }, (query) => {
              return query.data.pages.map((page, i) => {
                return (
                  <div key={i} className="space-y-2">
                    {page.items
                      .filter((item) => item.id !== organization.id)
                      .map((item) => {
                        return (
                          <OrganizationListItem
                            key={item.id}
                            organization={{
                              ...item,
                              numberMembers: item.members.length,
                            }}
                            onSuccess={() => onOpenChange(false)}
                          />
                        )
                      })}
                    {!query.isFetching && query.hasNextPage && (
                      <ViewportBlock onEnterViewport={() => query.fetchNextPage()} />
                    )}
                    {query.hasNextPage && <OrganizationListItemSkeleton />}
                  </div>
                )
              })
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
  organization: {
    id: string
    name: string
    logoUrl: string
    numberMembers: number
  }
  onSuccess?: () => void
  disabled?: boolean
}) {
  const utils = api.useUtils()
  const mutation = api.auth.organization.switch.useMutation({
    onSuccess() {
      utils.invalidate()
      props.onSuccess?.()
    },
  })

  return (
    <div className="flex gap-2 pl-2">
      <Button
        type="button"
        className="flex-1 justify-start gap-2"
        size={'icon'}
        variant={'ghost'}
        onClick={() => {
          mutation.mutate({
            organizationId: props.organization.id,
          })
        }}
        disabled={mutation.isLoading || props.disabled}
      >
        <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <MutationStatusIcon status={mutation.status}>
            <Avatar className="h-9 w-9 ">
              <AvatarImage
                alt={props.organization.name}
                src={constructPublicResourceUrl(props.organization.logoUrl)}
              />
              <AvatarFallback>{props.organization.name[0]}</AvatarFallback>
            </Avatar>
          </MutationStatusIcon>
        </div>

        <div className="flex flex-col items-start flex-1 overflow-hidden">
          <span className="truncate w-full text-left font-medium">{props.organization.name}</span>
          <span className="text-muted-foreground font-normal text-xs">{`${
            props.organization.numberMembers
          } ${props.organization.numberMembers === 1 ? 'member' : 'members'}`}</span>
        </div>
      </Button>

      <Button
        variant={'ghost'}
        size={'icon'}
        className="w-8"
        onClick={() => props.onSuccess?.()}
        asChild
      >
        <Link to={`/organizations/${props.organization.id}`}>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

function LogoutDropdownMenuItem() {
  const mutation = api.auth.logout.useMutation({
    onSettled() {
      useAuthStore.setState({ session: null })
    },
  })
  return (
    <Button
      type="button"
      variant={'ghost'}
      size={'default'}
      className="w-full justify-start font-normal px-2 h-8 gap-2"
      disabled={mutation.isLoading}
      onClick={() => mutation.mutate()}
    >
      <MutationStatusIcon status={mutation.status}>
        <LogOutIcon className="h-4 w-4" />
      </MutationStatusIcon>
      Log out
    </Button>
  )
}

function CreateOrganizationDropdownMenuItem() {
  const navigate = useNavigate()
  return (
    <OrganizationCreateSheet
      onSuccess={(data) => {
        navigate(`/organizations/${data.organization.id}`)
      }}
    >
      <SheetTrigger asChild>
        <Button
          type="button"
          variant={'ghost'}
          size={'default'}
          className="w-full justify-start font-normal px-2 h-8"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Organization
        </Button>
      </SheetTrigger>
    </OrganizationCreateSheet>
  )
}
