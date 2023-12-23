'use client'

import { Skeleton } from '+ui/ui/skeleton'
import { ViewportBlock } from '+ui/ui/viewport-block'
import { api } from '@web/lib/api'
import { isActivePathname } from '@web/utils/is-active-pathname'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const staticLinks = [
  {
    name: 'Profile',
    href: '/profile',
  },
  {
    name: 'Notifications',
    href: '/notifications',
  },
]

export function Nav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = api.organization.list.useInfiniteQuery(
    {
      limit: 6,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const organizationLinks =
    query.data?.pages.flatMap((page) =>
      page.items.map((organization) => ({
        name: organization.name,
        id: organization.id,
        href: `organization?id=${organization.id}`,
      })),
    ) ?? []

  return (
    <nav className="flex py-4">
      <ul
        role="list"
        className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-muted-foreground sm:px-6 lg:px-8"
      >
        {staticLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={isActivePathname(link.href, pathname) ? 'text-primary' : ''}
            >
              {link.name}
            </Link>
          </li>
        ))}

        {organizationLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={
                isActivePathname(link.href, pathname) && searchParams.get('id') === link.id
                  ? 'text-primary'
                  : ''
              }
            >
              {link.name}
            </Link>
          </li>
        ))}

        <li>
          {!query.isFetching && query.hasNextPage && (
            <ViewportBlock onEnterViewport={() => query.fetchNextPage()} />
          )}
          {(query.hasNextPage || query.isLoading) && <Skeleton className="w-36 h-6" />}
        </li>
      </ul>
    </nav>
  )
}
