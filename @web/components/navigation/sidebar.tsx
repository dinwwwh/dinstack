import { ThemeToggle } from '../theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '@web/components/ui/button'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { Skeleton } from '@web/components/ui/skeleton'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { useAuthedStore } from '@web/stores/auth'
import {
  ChevronsUpDownIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  Trash2Icon,
  UserRoundIcon,
} from 'lucide-react'
import { Link, matchPath, useLocation } from 'react-router-dom'

type Props = {
  onNavigate?: () => void
}

const menuItems = [
  {
    Icon: LayoutDashboardIcon,
    label: 'Dashboard',
    href: '/',
  },
  {
    Icon: UserRoundIcon,
    label: 'Users',
    href: '/users',
  },
  {
    Icon: Settings2Icon,
    label: 'Settings',
    href: '/settings',
  },
  {
    Icon: Trash2Icon,
    label: 'Trash',
    href: '/trash',
  },
]

export function Navbar(props: Props) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full">
      {/* TODO: dropdown menu */}
      <div className="flex gap-3 items-center">
        <Skeleton className="h-9 w-9 flex-shrink-0" />
        <Skeleton className="h-6 w-36" />
      </div>

      <div className="flex flex-col gap-2 mt-8 overflow-hidden">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={matchPath(item.href, location.pathname) ? 'default' : 'ghost'}
            className="justify-start p-2.5 w-full font-medium"
            size="sm"
            asChild
            onClick={props.onNavigate}
          >
            <Link to={item.href}>
              <item.Icon strokeWidth={1.5} className="h-4 w-4 mr-2.5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1 mt-8">{/* SOME THING */}</ScrollArea>

      <div className="flex flex-row-reverse flex-wrap gap-4">
        <ThemeToggle />

        <OrganizationButton />
      </div>
    </div>
  )
}

function OrganizationButton() {
  const organization = useAuthedStore().session.organization

  return (
    // TODO: dropdown menu
    <Button
      type="button"
      className="flex-1 justify-between w-full overflow-hidden gap-2 pl-0"
      size={'sm'}
      variant={'ghost'}
    >
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage
            alt={organization.name}
            src={constructPublicResourceUrl(organization.logoUrl)}
          />
          <AvatarFallback>{organization.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span>{organization.name}</span>
          <span className="text-muted-foreground font-normal text-xs">{`${
            organization.members.length
          } ${organization.members.length === 1 ? 'member' : 'members'}`}</span>
        </div>
      </div>

      <div className="pr-2.5">
        <ChevronsUpDownIcon strokeWidth={1.5} className="h-4 w-4" />
      </div>
    </Button>
  )
}
