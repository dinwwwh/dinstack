'use client'

import { Button } from '@dinstack/ui/button'
import { ScrollArea } from '@dinstack/ui/scroll-area'
import { Skeleton } from '@dinstack/ui/skeleton'
import { DashboardIcon } from '@radix-ui/react-icons'
import { ThemeToggle } from '@web/components/theme-toggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { match } from 'ts-pattern'

type Props = {
  size?: 'default' | 'icon'
}

const menuItems = [
  {
    Icon: DashboardIcon,
    label: 'Dashboard',
    href: '/dash',
  },
  {
    Icon: DashboardIcon,
    label: 'Dashboard2',
    href: '/dash2',
  },
]

export function Navbar({ size = 'default' }: Props) {
  const pathname = usePathname()

  const isActiveLink = (href: string) => `${pathname}/`.startsWith(`${href}/`)

  return (
    <div className="flex flex-col h-full">
      {match(size)
        .with('default', () => (
          <Button type="button" variant={'ghost'} size={'icon'} className="w-full justify-start px-1">
            <Skeleton className="h-9 w-9 mr-3" />
            <Skeleton className="h-6 w-36" />
          </Button>
        ))
        .with('icon', () => (
          <Button type="button" variant={'ghost'} size={'icon'}>
            <Skeleton className="h-9 w-9" />
          </Button>
        ))
        .exhaustive()}

      <ScrollArea className="flex-1 mt-8">
        <div className="flex flex-col gap-4">
          {match(size)
            .with('default', () =>
              menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-3"
                  asChild
                >
                  <Link href={item.href}>
                    <item.Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                </Button>
              )),
            )
            .with('icon', () =>
              menuItems.map((item) => (
                <Button key={item.href} variant={isActiveLink(item.href) ? 'secondary' : 'ghost'} size={'icon'} asChild>
                  <Link href={item.href}>
                    <item.Icon className="h-4 w-4" />
                  </Link>
                </Button>
              )),
            )
            .exhaustive()}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-4">
        {match(size)
          .with('default', () => (
            <div className="px-1">
              <ThemeToggle />
            </div>
          ))
          .with('icon', () => <ThemeToggle />)
          .exhaustive()}

        {match(size)
          .with('default', () => (
            <Button type="button" variant={'ghost'} size={'icon'} className="w-full justify-start px-1">
              <Skeleton className="h-9 w-9 mr-3" />
              <Skeleton className="h-6 w-36" />
            </Button>
          ))
          .with('icon', () => (
            <Button type="button" variant={'ghost'} size={'icon'}>
              <Skeleton className="h-9 w-9" />
            </Button>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
