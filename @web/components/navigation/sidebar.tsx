import { Logo } from '../logo'
import { PushNotificationPermissionRequest } from '../push-notification-alert'
import { ThemeToggle } from '../theme-toggle'
import { LogoDropdownMenu } from './logo-dropdown-menu'
import { OrganizationSwitcher, UserButton } from '@clerk/clerk-react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '@web/components/ui/button'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { cn } from '@web/lib/utils'
import { useSystemStore } from '@web/stores/system'
import { LayoutDashboardIcon, Settings2Icon, Trash2Icon, UserRoundIcon } from 'lucide-react'
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

export function Navbar() {
  const location = useLocation()
  const systemStore = useSystemStore()

  return (
    <div className="flex flex-col h-full @container">
      <div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: 'w-full',
              organizationSwitcherTrigger: cn(
                'w-full justify-between p-0 overflow-hidden',
                '[&_.cl-organizationPreviewMainIdentifier]:text-sm',
                '[&_.cl-userPreviewAvatarBox]:size-8',
                '[&_.cl-organizationPreviewAvatarBox]:size-8',
                '[&_.cl-userPreviewAvatarContainer]:shrink-0',
                '[&_.cl-organizationPreviewAvatarContainer]:shrink-0',
                '[&_.cl-organizationPreview]:shrink-0',
              ),
            },
          }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-8">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={matchPath(item.href, location.pathname) ? 'default' : 'ghost'}
            className="justify-start p-2 w-full font-medium overflow-hidden h-8"
            size="sm"
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

      <div className="mt-8 hidden @[200px]:block">
        {systemStore.dismissedPushNotificationAlertAt &&
        systemStore.dismissedPushNotificationAlertAt >=
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? null : (
          <PushNotificationPermissionRequest
            onDismiss={() => {
              useSystemStore.setState({ dismissedPushNotificationAlertAt: new Date() })
            }}
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-8 overflow-hidden">
        <div className="flex gap-4 shrink-0">
          <div className="shrink-0">
            <UserButton
              appearance={{
                elements: {
                  userButtonTrigger: cn('[&_.cl-userButtonAvatarBox]:size-8'),
                },
              }}
            />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>

        <div>
          <LogoDropdownMenu>
            <DropdownMenuTrigger>
              <span className="sr-only">Open Main Menu</span>
              <Logo size={32} variant="icon" />
            </DropdownMenuTrigger>
          </LogoDropdownMenu>
        </div>
      </div>
    </div>
  )
}
