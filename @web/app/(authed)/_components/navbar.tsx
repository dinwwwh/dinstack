'use client'

import { Button } from '@dinstack/ui/button'
import { DropdownMenuTrigger } from '@dinstack/ui/dropdown-menu'
import { ScrollArea } from '@dinstack/ui/scroll-area'
import { Skeleton } from '@dinstack/ui/skeleton'
import { CaretDownIcon, DashboardIcon } from '@radix-ui/react-icons'
import { useAuthedAtom } from '@web/atoms/auth'
import { ProfileDropdownMenu } from '@web/components/profile-dropdown-menu'
import { ThemeToggle } from '@web/components/theme-toggle'
import { api } from '@web/lib/api'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { match } from 'ts-pattern'

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
  const [auth] = useAuthedAtom()

  const query = api.organization.detail.useQuery({
    organizationId: auth.organizationMember.organization.id,
  })

  const orgName = query.data?.organization.name ?? auth.organizationMember.organization.name
  const orgLogoUrl = query.data?.organization.logoUrl ?? auth.organizationMember.organization.logoUrl

  return (
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        className="flex-1 justify-between w-full overflow-hidden gap-2"
        size={'icon'}
        variant={'secondary'}
      >
        <div className="flex gap-3">
          <img src={orgLogoUrl} className="h-9 w-9 rounded-md flex-shrink-0" alt={orgName} />
          <div className="flex flex-col items-start">
            <span>{orgName}</span>
            {match(query)
              .with({ status: 'loading' }, () => <Skeleton className="h-4 w-20" />)
              .with({ status: 'error' }, () => '')
              .with({ status: 'success' }, (query) => (
                <span className="text-muted-foreground font-normal text-xs">{`${
                  query.data.organization.members.length
                } ${query.data.organization.members.length === 1 ? 'member' : 'members'}`}</span>
              ))
              .exhaustive()}
          </div>
        </div>

        <div className="pr-2.5">
          <CaretDownIcon className="h-4 w-4" />
        </div>
      </Button>
    </DropdownMenuTrigger>
  )
}
