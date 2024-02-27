import { Logo } from '../logo'
import { NotificationButton } from '../notification-button'
import { SubscriptionCard } from '../subscription-card'
import { ThemeToggle } from '../theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Skeleton } from '../ui/skeleton'
import { AuthDropdownMenu } from './auth-dropdown-menu'
import { LogoDropdownMenu } from './logo-dropdown-menu'
import { useOrganization } from '@clerk/clerk-react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button, buttonVariants } from '@web/components/ui/button'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { useLifetimeAccessSubscription } from '@web/hooks/use-lifetime-access-subscription'
import { useAuthedUser } from '@web/lib/auth'
import { constructPublicResourceUrl } from '@web/lib/bucket'
import { env } from '@web/lib/env'
import { cn } from '@web/lib/utils'
import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  CrownIcon,
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  SearchIcon,
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

      <div className="mt-6 space-y-2">
        <UpgradeButton />
        <Button
          variant="outline"
          className={cn(
            'p-2.5 relative w-full justify-start bg-background text-sm font-normal text-muted-foreground items-center overflow-hidden',
          )}
        >
          <SearchIcon className="size-4 mr-2 shrink-0" />
          <div className="flex-1 flex items-center justify-start">
            <span className="hidden lg:inline-flex">Search documentation...</span>
            <span className="inline-flex lg:hidden">Search...</span>
          </div>
          <kbd className="flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <h4 className="text-muted-foreground text-sm pb-1 pl-1 invisible @[200px]:visible">Menu</h4>
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={matchPath(item.href, location.pathname) ? 'default' : 'ghost'}
            className="justify-start p-2.5 w-full font-medium overflow-hidden"
            asChild
          >
            <Link to={item.href}>
              <item.Icon className="size-4 mr-2.5 flex-shrink-0" />
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
        <div className="flex-1 hidden @[200px]:block">
          <BillingButton />
        </div>
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
            <ChevronsUpDownIcon className="size-4 text-muted-foreground group-hover:text-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
    </AuthDropdownMenu>
  )
}

function UpgradeButton() {
  const subscription = useLifetimeAccessSubscription()

  if (subscription) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="justify-start p-2.5 w-full overflow-hidden">
          <CrownIcon className="size-4 shrink-0 mr-2.5" />
          <span>Upgrade Now</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-screen overflow-auto flex">
        <ScrollArea className="flex-1 pt-8">
          <SubscriptionCard />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function BillingButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'} className="justify-start p-2.5 w-full overflow-hidden">
          <CreditCardIcon className="size-4 shrink-0 mr-2.5" />
          <span>Billing</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-screen overflow-auto flex">
        <ScrollArea className="flex-1 pt-8">
          <SubscriptionCard />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
