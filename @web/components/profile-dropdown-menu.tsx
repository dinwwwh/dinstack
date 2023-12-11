import { ReloadIcon } from '@radix-ui/react-icons'
import { useAuthedAtom } from '@web/atoms/auth'
import { api } from '@web/lib/api'
import { RESET } from 'jotai/utils'
import { useEffect, useState } from 'react'
import { match } from 'ts-pattern'
import { Button } from '@ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@ui/ui/dropdown-menu'
import { ScrollArea } from '@ui/ui/scroll-area'
import { SheetTrigger } from '@ui/ui/sheet'
import { Skeleton } from '@ui/ui/skeleton'
import { ViewportBlock } from '@ui/ui/viewport-block'
import { OrganizationCreateSheet } from './organization-create-sheet'

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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* TODO: implement */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <CreateOrganizationDropdownMenuItem />
          <LogoutDropdownMenuItem />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <WorkspaceList onOpenChange={_onOpenChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function WorkspaceList({ onOpenChange }: { onOpenChange: (v: boolean) => void }) {
  const [auth] = useAuthedAtom()
  const detailQuery = api.organization.detail.useQuery({
    organizationId: auth.organizationMember.organization.id,
  })
  const currentOrgName = detailQuery.data?.organization.name ?? auth.organizationMember.organization.name
  const currentOrgLogoUrl = detailQuery.data?.organization.logoUrl ?? auth.organizationMember.organization.logoUrl

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
          <WorkspaceListItem
            organization={{
              id: auth.organizationMember.organization.id,
              name: currentOrgName,
              logoUrl: currentOrgLogoUrl,
              numberMembers: {
                number: detailQuery.data?.organization.members.length,
                status: detailQuery.status,
              },
            }}
            disabled
            onSuccess={() => onOpenChange(false)}
          />

          {match(listQuery)
            .with({ status: 'loading' }, () => <WorkspaceListItemSkeleton />)
            .with({ status: 'error' }, () => '')
            .with({ status: 'success' }, (query) => {
              return query.data.pages.map((page) => {
                return (
                  <>
                    {page.items
                      .filter((item) => item.id !== auth.organizationMember.organization.id)
                      .map((item) => {
                        return (
                          <WorkspaceListItem
                            key={item.id}
                            organization={{
                              ...item,
                              numberMembers: {
                                number: item.members.length,
                                status: 'success',
                              },
                            }}
                            onSuccess={() => onOpenChange(false)}
                          />
                        )
                      })}
                    {!query.isFetching && query.hasNextPage && (
                      <ViewportBlock onEnterViewport={() => query.fetchNextPage()} />
                    )}
                    {query.hasNextPage && <WorkspaceListItemSkeleton />}
                  </>
                )
              })
            })
            .exhaustive()}
        </div>
      </ScrollArea>
    </DropdownMenuGroup>
  )
}

function WorkspaceListItemSkeleton() {
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

function WorkspaceListItem(props: {
  organization: {
    id: string
    name: string
    logoUrl: string
    numberMembers: {
      number?: number
      status: 'loading' | 'error' | 'success'
    }
  }
  onSuccess?: () => void
  disabled?: boolean
}) {
  const [, setAuth] = useAuthedAtom()
  const utils = api.useUtils()
  const mutation = api.auth.organization.switch.useMutation({
    onSuccess(data) {
      setAuth(data.auth)
      utils.invalidate()
      props.onSuccess?.()
    },
  })

  return (
    <div className="flex gap-2 pl-2">
      <Button
        type="button"
        className="flex-1 justify-start"
        size={'icon'}
        variant={'ghost'}
        onClick={() => {
          mutation.mutate({
            organizationId: props.organization.id,
          })
        }}
        disabled={props.disabled}
      >
        {mutation.isLoading ? (
          <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center mr-2">
            <ReloadIcon className="h-4 w-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <img src={props.organization.logoUrl} className="h-9 w-9 mr-2 rounded-md" alt={props.organization.name} />
        )}
        <div className="flex flex-col items-start">
          <span>{props.organization.name}</span>
          {match(props.organization.numberMembers)
            .with({ status: 'loading' }, () => <Skeleton className="h-4 w-20" />)
            .with({ status: 'error' }, () => '')
            .with({ status: 'success' }, (data) => (
              <span className="text-muted-foreground font-normal text-xs">{`${data.number} ${
                data.number === 1 ? 'member' : 'members'
              }`}</span>
            ))
            .exhaustive()}
        </div>
      </Button>

      {/* TODO: implement */}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger />
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>More...</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </div>
  )
}

function LogoutDropdownMenuItem() {
  const [, setAuth] = useAuthedAtom()
  return <DropdownMenuItem onClick={() => setAuth(RESET)}>Log out</DropdownMenuItem>
}

function CreateOrganizationDropdownMenuItem() {
  return (
    <OrganizationCreateSheet>
      <SheetTrigger asChild>
        <Button type="button" variant={'ghost'} size={'default'} className="w-full justify-start font-normal px-2 h-8">
          Create Organization
        </Button>
      </SheetTrigger>
    </OrganizationCreateSheet>
  )
}
