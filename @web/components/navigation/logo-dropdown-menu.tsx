import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@web/components/ui/dropdown-menu'
import { env } from '@web/lib/env'
import { GithubIcon, TwitterIcon, HomeIcon } from 'lucide-react'

export function LogoDropdownMenu({ children, ...props }: { children: React.ReactNode }) {
  return (
    <DropdownMenu {...props}>
      {children}
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem asChild>
          <a href={env.CONTENT_BASE_URL}>
            <HomeIcon className="mr-2 h-4 w-4" />
            <span>Home</span>
          </a>
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
