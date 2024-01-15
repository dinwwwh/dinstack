import { ScrollArea, ScrollBar } from '@ui/components/ui/scroll-area'
import { cn } from '@ui/lib/utils'
import { Helmet } from 'react-helmet-async'
import { Link, Outlet, matchPath, useLocation } from 'react-router-dom'

export function ProfileLayout() {
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <div className="mx-auto max-w-5xl py-6 md:py-8 xl:py-12 px-4">
        <h1 className="text-2xl font-medium tracking-wide">Profile</h1>
        <ScrollArea className="mt-6 xl:mt-8 border-b">
          <Nav />

          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
        <Outlet />
      </div>
    </>
  )
}

const tabs = [
  { name: 'General', href: '/profile' },
  { name: 'Accounts', href: '/profile/accounts' },
  { name: 'Billing', href: '/profile/billing' },
]

function Nav() {
  const location = useLocation()

  return (
    <nav className="flex space-x-8">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          to={tab.href}
          className={cn(
            matchPath(tab.href, location.pathname)
              ? 'border-b-2 border-primary/80 text-primary'
              : 'text-muted-foreground hover:text-foreground/80',
            'whitespace-nowrap py-4 px-1 text-sm font-medium',
          )}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  )
}
