import { Button } from '@dinstack/ui/button'
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
} from '@dinstack/ui/dropdown-menu'
import { ScrollArea } from '@dinstack/ui/scroll-area'
import { SheetTrigger } from '@dinstack/ui/sheet'
import { Skeleton } from '@dinstack/ui/skeleton'
import { api } from '@web/lib/api'
import { useAuthedStore } from '@web/stores/auth'
import { useEffect, useState } from 'react'
import { match } from 'ts-pattern'
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
          <DropdownMenuSeparator />
          <LogoutDropdownMenuItem />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <WorkspaceList onOpenChange={_onOpenChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function WorkspaceList({ onOpenChange }: { onOpenChange: (v: boolean) => void }) {
  const auth = useAuthedStore()
  const detailQuery = api.organization.detail.useQuery({
    organizationId: auth.organizationMember.organization.id,
  })
  const currentOrgName = detailQuery.data?.organization.name ?? auth.organizationMember.organization.name
  const currentOrgLogoUrl = detailQuery.data?.organization.logoUrl ?? auth.organizationMember.organization.logoUrl

  const listQuery = api.organization.list.useInfiniteQuery({
    limit: 10,
  })

  return (
    <DropdownMenuGroup>
      <ScrollArea
        style={{
          height: listQuery.data?.pages.length ?? 0 > 4 ? '200px' : 'auto',
        }}
      >
        <div className="space-y-2 py-2">
          <WorkspaceListItem
            name={currentOrgName}
            logoUrl={currentOrgLogoUrl}
            numberMembers={{
              number: detailQuery.data?.organization.members.length,
              status: detailQuery.status,
            }}
            disabled
            onClick={() => onOpenChange(false)}
          />

          {match(listQuery)
            .with({ status: 'loading' }, () => (
              <div className="flex gap-2 pl-2">
                <Skeleton className="h-9 w-9" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
            .with({ status: 'error' }, () => '')
            .with({ status: 'success' }, (query) => {
              return query.data.pages.map((page, i) => {
                return page.items
                  .filter((item) => item.id !== auth.organizationMember.organization.id)
                  .map((item) => {
                    return (
                      <WorkspaceListItem
                        key={item.id}
                        name={item.name}
                        logoUrl={item.logoUrl}
                        numberMembers={{
                          number: item.members.length,
                          status: 'success',
                        }}
                        onClick={() => onOpenChange(false)}
                      />
                    )
                  })
              })
            })
            .exhaustive()}
        </div>
      </ScrollArea>
    </DropdownMenuGroup>
  )
}

function WorkspaceListItem(props: {
  name: string
  logoUrl: string
  onClick: () => void
  numberMembers: {
    number?: number
    status: 'loading' | 'error' | 'success'
  }
  disabled?: boolean
}) {
  return (
    <div className="flex gap-2 pl-2">
      <Button
        type="button"
        className="flex-1 justify-start"
        size={'icon'}
        variant={'ghost'}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        <img src={props.logoUrl} className="h-9 w-9 mr-2 rounded-md" alt={props.name} />
        <div className="flex flex-col items-start">
          <span>{props.name}</span>
          {match(props.numberMembers)
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
  const auth = useAuthedStore()
  return <DropdownMenuItem onClick={() => auth.reset()}>Log out</DropdownMenuItem>
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
