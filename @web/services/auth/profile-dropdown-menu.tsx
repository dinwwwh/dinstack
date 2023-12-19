import { ExitIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons'
import { api } from '@web/lib/api'
import { constructPublicResourceUrl } from '@web/lib/utils'
import { sessionIdAtom } from '@web/services/auth/atoms'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { match } from 'ts-pattern'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/ui/avatar'
import { Button } from '@ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@ui/ui/dropdown-menu'
import { MutationStatusIcon } from '@ui/ui/mutation-status-icon'
import { ScrollArea } from '@ui/ui/scroll-area'
import { SheetTrigger } from '@ui/ui/sheet'
import { Skeleton } from '@ui/ui/skeleton'
import { ViewportBlock } from '@ui/ui/viewport-block'
import { OrganizationCreateSheet } from '../../components/organization-create-sheet'

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
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <PersonIcon className="h-4 w-4 mr-2" />
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
  const sessionInfosQuery = api.auth.infos.useQuery()
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
          {match(listQuery)
            .with({ status: 'loading' }, () => <OrganizationListItemSkeleton />)
            .with({ status: 'error' }, () => '')
            .with({ status: 'success' }, (query) => {
              return query.data.pages.map((page, i) => {
                return (
                  <div key={i} className="space-y-2">
                    {page.items.map((item) => {
                      return (
                        <OrganizationListItem
                          key={item.id}
                          organization={{
                            ...item,
                            numberMembers: {
                              number: item.members.length,
                              status: 'success',
                            },
                          }}
                          disabled={item.id === sessionInfosQuery.data?.session.organizationId}
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
    numberMembers: {
      number?: number
      status: 'loading' | 'error' | 'success'
    }
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
            organization: props.organization,
          })
        }}
        disabled={mutation.isLoading || props.disabled}
      >
        <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <MutationStatusIcon status={mutation.status}>
            <Avatar className="h-9 w-9 ">
              <AvatarImage alt={props.organization.name} src={constructPublicResourceUrl(props.organization.logoUrl)} />
              <AvatarFallback>{props.organization.name[0]}</AvatarFallback>
            </Avatar>
          </MutationStatusIcon>
        </div>

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

      <DropdownMenuSub>
        <DropdownMenuSubTrigger />
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem asChild>
              <Link href={`/organization?id=${props.organization.id}`}>Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </div>
  )
}

function LogoutDropdownMenuItem() {
  const [, setSessionId] = useAtom(sessionIdAtom)
  const mutation = api.auth.logout.useMutation({
    onSuccess() {
      setSessionId(RESET)
    },
  })
  return (
    <DropdownMenuItem onClick={() => mutation.mutate()}>
      <ExitIcon className="h-4 w-4 mr-2" />
      Log out
    </DropdownMenuItem>
  )
}

function CreateOrganizationDropdownMenuItem() {
  return (
    <OrganizationCreateSheet>
      <SheetTrigger asChild>
        <Button type="button" variant={'ghost'} size={'default'} className="w-full justify-start font-normal px-2 h-8">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </SheetTrigger>
    </OrganizationCreateSheet>
  )
}
