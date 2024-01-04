import { ScrollArea, ScrollBar } from '@web/components/ui/scroll-area'
import { cn } from '@web/lib/utils'
import { Link, Outlet, matchPath, useLocation, useParams } from 'react-router-dom'
import { z } from 'zod'

export function OrganizationLayout() {
  return (
    <div className="mx-auto max-w-5xl py-6 md:py-8 xl:py-12 px-4">
      <h1 className="text-2xl font-medium tracking-wide">Organization Settings</h1>
      <ScrollArea className="mt-6 xl:mt-8 border-b">
        <Nav />

        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
      <Outlet />
    </div>
  )
}

function Nav() {
  const params = z
    .object({
      organizationId: z.string().uuid(),
    })
    .parse(useParams())
  const location = useLocation()

  const tabs = [
    { name: 'General', href: `/organizations/${params.organizationId}` },
    { name: 'Members', href: `/organizations/${params.organizationId}/members` },
  ]

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
