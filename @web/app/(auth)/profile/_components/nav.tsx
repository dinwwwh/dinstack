'use client'

import { isActivePathname } from '@web/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
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

  return (
    <nav className="flex py-4">
      <ul
        role="list"
        className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-muted-foreground sm:px-6 lg:px-8"
      >
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className={isActivePathname(link.href, pathname) ? 'text-primary' : ''}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
