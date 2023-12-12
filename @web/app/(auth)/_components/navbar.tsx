'use client'

import { CaretDownIcon, DashboardIcon } from '@radix-ui/react-icons'
import { ProfileDropdownMenu } from '@web/components/profile-dropdown-menu'
import { ThemeToggle } from '@web/components/theme-toggle'
import { api } from '@web/lib/api'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { match } from 'ts-pattern'
import { Button } from '@ui/ui/button'
import { DropdownMenuTrigger } from '@ui/ui/dropdown-menu'
import { ScrollArea } from '@ui/ui/scroll-area'
import { Skeleton } from '@ui/ui/skeleton'

type Props = {
  onNavigate?: () => void
}

const menuItems = [
  {
    Icon: DashboardIcon,
    label: 'Dashboard',
    href: '/dash',
  },
  {
    Icon: DashboardIcon,
    label: 'Dashboard2',
    href: '/dash2',
  },
]

export function Navbar(props: Props) {
  const pathname = usePathname()

  const isActiveLink = (href: string) => `${pathname}/`.startsWith(`${href}/`)

  return (
    <div className="flex flex-col h-full">
      <Button variant={'ghost'} className="justify-start w-full" size="icon">
        <Skeleton className="h-9 w-9 mr-3 flex-shrink-0" />
        <Skeleton className="h-6 w-36" />
      </Button>

      <ScrollArea className="flex-1 mt-8 h-20">
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
              className="justify-start p-2.5 w-full"
              size="icon"
              asChild
              onClick={props.onNavigate}
            >
              <Link href={item.href}>
                <item.Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-row-reverse flex-wrap gap-4">
        <ThemeToggle />

        <ProfileDropdownMenu>
          <ProfileButton />
        </ProfileDropdownMenu>
      </div>
    </div>
  )
}

function ProfileButton() {
  const sessionInfosQuery = api.auth.infos.useQuery()

  return (
    <DropdownMenuTrigger asChild>
      {match(sessionInfosQuery)
        .with({ status: 'loading' }, () => (
          <div className="flex-1 flex gap-3 items-center overflow-hidden">
            <Skeleton className="h-9 w-9 flex-shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))
        .with({ status: 'error' }, () => '')
        .with({ status: 'success' }, (query) => (
          <Button
            type="button"
            className="flex-1 justify-between w-full overflow-hidden gap-2"
            size={'icon'}
            variant={'secondary'}
          >
            <div className="flex gap-3">
              <img
                src={query.data.session.organizationMember.organization.logoUrl}
                className="h-9 w-9 rounded-md flex-shrink-0"
                alt={query.data.session.organizationMember.organization.name}
              />
              <div className="flex flex-col items-start">
                <span>{query.data.session.organizationMember.organization.name}</span>
                <span className="text-muted-foreground font-normal text-xs">{`${
                  query.data.session.organizationMember.organization.members.length
                } ${
                  query.data.session.organizationMember.organization.members.length === 1 ? 'member' : 'members'
                }`}</span>
              </div>
            </div>

            <div className="pr-2.5">
              <CaretDownIcon className="h-4 w-4" />
            </div>
          </Button>
        ))
        .exhaustive()}
    </DropdownMenuTrigger>
  )
}
