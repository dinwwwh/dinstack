import { GitHubIcon, TwitterIcon } from '../icons'
import { ModeToggle } from '../mode-toggle'
// import { MainNav } from '@/components/main-nav'
// import { MobileNav } from '@/components/mobile-nav'
import { siteConfig } from '@content/config/site'
import { Button } from '@web/components/ui/button'
import { cn } from '@web/lib/utils'
import Link from 'next/link'

export function Header() {
  return (
    <header>
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* <MainNav /> */}
        {/* <MobileNav /> */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* <CommandMenu /> */}</div>
          <nav className="flex items-center">
            <Button variant={'ghost'} className={cn('w-9 px-0')} asChild>
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <GitHubIcon className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant={'ghost'} className={cn('w-9 px-0')} asChild>
              <a href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                <TwitterIcon className="h-3 w-3 fill-current" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
