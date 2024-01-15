import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@ui/components/ui/dropdown-menu'
import { GithubIcon, TwitterIcon, HomeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export function LogoDropdownMenu({ children, ...props }: { children: React.ReactNode }) {
  return (
    <DropdownMenu {...props}>
      {children}
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="https://github.com/dinsterizer/dinstack">
            <GithubIcon className="mr-2 h-4 w-4" />
            <span>Github</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="https://x.com/dinsterizer">
            <TwitterIcon className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
