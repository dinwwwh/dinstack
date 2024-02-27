import { Logo } from '../logo'
import { NotificationButton } from '../notification-button'
import { ThemeToggle } from '../theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { AuthDropdownMenu } from './auth-dropdown-menu'
import { LogoDropdownMenu } from './logo-dropdown-menu'
import { useOrganization, useUser } from '@clerk/clerk-react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button, buttonVariants } from '@web/components/ui/button'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { useAuthedUser } from '@web/lib/auth'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { env } from '@web/lib/env'
import { cn } from '@web/lib/utils'
import {
  ChevronsUpDownIcon,
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  Settings2Icon,
  Trash2Icon,
  UserRoundIcon,
} from 'lucide-react'
import { Link, matchPath, useLocation } from 'react-router-dom'

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

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full @container">
      <LogoDropdownMenu>
        <DropdownMenuTrigger className="p-1.5 pr-2">
          <span className="sr-only">Open Main Menu</span>
          <Logo size={24} />
        </DropdownMenuTrigger>
      </LogoDropdownMenu>

      <div className="flex flex-col gap-2 mt-8">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={matchPath(item.href, location.pathname) ? 'default' : 'ghost'}
            className="justify-start p-2.5 w-full font-medium overflow-hidden"
            asChild
          >
            <Link to={item.href}>
              <item.Icon className="h-4 w-4 mr-2.5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1 mt-8">{/* SOME THING */}</ScrollArea>

      <div className="mt-8 hidden @[200px]:block"></div>

      <div className="flex items-center gap-3 py-2">
        <div
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'icon' }),
            '[&_.rnf-notification-icon-button]:size-6',
            '[&_.rnf-notification-icon-button>svg]:size-4',
            'shrink-0',
          )}
        >
          <NotificationButton />
        </div>
        <ThemeToggle variant="secondary" className="h-9 w-9" />
        <Button variant={'secondary'} size={'icon'} asChild>
          <a href={`mailto:${env.SUPPORT_EMAIL}`}>
            <span className="sr-only">Help</span>
            <MessageCircleQuestionIcon className="size-4" />
          </a>
        </Button>
      </div>

      <div className="pt-2">
        <OrganizationButton />
      </div>
    </div>
  )
}

function OrganizationButton() {
  const clerkOrganization = useOrganization()
  const clerkUser = useAuthedUser()

  if (!clerkOrganization.isLoaded) {
    return <Skeleton className="h-9 w-full" />
  }

  return (
    <AuthDropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          className="flex-1 justify-between w-full overflow-hidden gap-2 pl-0 group"
          variant={'ghost'}
        >
          {clerkOrganization.organization ? (
            <>
              <Avatar className="h-9 w-9 flex-shrink-0 ">
                <AvatarImage
                  alt={clerkOrganization.organization.name}
                  src={constructPublicResourceUrl(clerkOrganization.organization.imageUrl)}
                />
                <AvatarFallback>{clerkOrganization.organization.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1 overflow-hidden">
                <span className="truncate w-full text-left font-medium">
                  {clerkOrganization.organization.name}
                </span>
                <span className="text-muted-foreground font-normal text-xs">{`${
                  clerkOrganization.organization.membersCount
                } ${
                  clerkOrganization.organization.membersCount === 1 ? 'member' : 'members'
                }`}</span>
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage
                  alt={clerkUser.user.fullName || ''}
                  src={constructPublicResourceUrl(clerkUser.user.imageUrl)}
                />
                <AvatarFallback>{(clerkUser.user.fullName || '')[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1 overflow-hidden">
                <span className="truncate w-full text-left font-medium">
                  {clerkUser.user.fullName || ''}
                </span>
                <span className="text-muted-foreground font-normal text-xs">Personal Only</span>
              </div>
            </>
          )}

          <div>
            <ChevronsUpDownIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
    </AuthDropdownMenu>
  )
}
