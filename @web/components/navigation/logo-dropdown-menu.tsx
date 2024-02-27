import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@web/components/ui/dropdown-menu'
import { env } from '@web/lib/env'
import { GithubIcon, TwitterIcon, HomeIcon, ExternalLinkIcon } from 'lucide-react'
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
        <DropdownMenuItem asChild>
          <a href={env.CONTENT_BASE_URL} target="_blank" rel="noreferrer">
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            <span>Document</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={env.GITHUB_REPOSITORY_URL} target="_blank" rel="noreferrer">
            <GithubIcon className="mr-2 h-4 w-4" />
            <span>Github</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={env.TWITTER_AUTHOR_PROFILE_URL} target="_blank" rel="noreferrer">
            <TwitterIcon className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
