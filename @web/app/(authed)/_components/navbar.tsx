'use client'

import { Button } from '@dinstack/ui/button'
import { ScrollArea } from '@dinstack/ui/scroll-area'
import { Skeleton } from '@dinstack/ui/skeleton'
import { DashboardIcon } from '@radix-ui/react-icons'
import { ThemeToggle } from '@web/components/theme-toggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
      <Button variant={'ghost'} className="justify-start w-full" size="icon">
        <Skeleton className="h-9 w-9 mr-3 flex-shrink-0" />
        <Skeleton className="h-6 w-36" />
      </Button>

      <ScrollArea className="flex-1 mt-8 h-20">
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
              className="justify-start p-2.5 w-full"
              size="icon"
              asChild
            >
              <Link href={item.href}>
                <item.Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-4">
        <ThemeToggle />

        <Button variant={'ghost'} className="justify-start w-full" size="icon">
          <Skeleton className="h-9 w-9 mr-3 flex-shrink-0" />
          <Skeleton className="h-6 w-36" />
        </Button>
      </div>
    </div>
  )
}
