import { Logo } from '../logo'
import { Button } from '../ui/button'
import { LogoDropdownMenu } from './logo-dropdown-menu'
import { OrganizationSwitcher, UserButton } from '@clerk/clerk-react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { cn } from '@web/lib/utils'
import { BellIcon } from 'lucide-react'

export function Header() {
  return (
    <header className="flex justify-between">
      <div className="flex items-center">
        <LogoDropdownMenu>
          <DropdownMenuTrigger>
            <Logo size={28} variant="icon" />
          </DropdownMenuTrigger>
        </LogoDropdownMenu>
        <span className="text-muted-foreground/50 px-3 font-thin">|</span>
        <div className="h-7 ">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: '[&.cl-organizationSwitcher-root]:h-7',
                organizationSwitcherTrigger: cn(
                  'w-full p-0',
                  '[&_.cl-organizationPreviewMainIdentifier]:text-sm',
                  '[&_.cl-userPreviewAvatarBox]:size-7',
                  '[&_.cl-organizationPreviewAvatarBox]:size-7',
                ),
              },
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* TODO */}
        <Button
          type="button"
          size={'sm'}
          className="size-7 p-0 text-muted-foreground"
          variant={'ghost'}
        >
          <span className="sr-only">Notifications</span>
          <BellIcon className="size-5" />
        </Button>

        <UserButton
          appearance={{
            elements: {
              rootBox: '[&.cl-userButton-root]:h-7 [&.cl-userButton-root]:pl-1',
            },
          }}
        />
      </div>
    </header>
  )
}
