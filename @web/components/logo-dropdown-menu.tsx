import { DashboardIcon, GitHubLogoIcon, HomeIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@ui/ui/dropdown-menu'

export function LogoDropdownMenu({ children, ...props }: { children: React.ReactNode }) {
  return (
    <DropdownMenu {...props}>
      {children}
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dash">
            <DashboardIcon className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="https://github.com/dinsterizer/dinstack">
            <GitHubLogoIcon className="mr-2 h-4 w-4" />
            <span>Github</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="https://x.com/dinsterizer">
            <TwitterLogoIcon className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
