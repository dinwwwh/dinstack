'use client'

import { Button } from '@dinstack/ui/button'
import { ScrollArea } from '@dinstack/ui/scroll-area'
import { Skeleton } from '@dinstack/ui/skeleton'
import { DashboardIcon } from '@radix-ui/react-icons'
import { match } from 'ts-pattern'

type Props = {
  size?: 'default' | 'icon'
}

const menuItems = [
  {
    Icon: DashboardIcon,
    label: 'Dashboard',
  },
  {
    Icon: DashboardIcon,
    label: 'Dashboard2',
  },
  {
    Icon: DashboardIcon,
    label: 'Dashboard3',
  },
  {
    Icon: DashboardIcon,
    label: 'Dashboard4',
  },
  {
    Icon: DashboardIcon,
    label: 'Dashboard5',
  },
]

export function Navbar({ size = 'default' }: Props) {
  return (
    <div className="flex flex-col h-full">
      {match(size)
        .with('default', () => (
          <Button type="button" variant={'ghost'} size={'lg'} className="w-full justify-start px-3">
            <Skeleton className="h-8 w-8 mr-3" />
            <Skeleton className="h-6 w-36" />
          </Button>
        ))
        .with('icon', () => (
          <Button type="button" variant={'ghost'} size={'icon'}>
            <Skeleton className="h-8 w-8" />
          </Button>
        ))
        .exhaustive()}

      <ScrollArea className="flex-1 mt-8">
        <div className="flex flex-col gap-4">
          {match(size)
            .with('default', () =>
              menuItems.map((item) => (
                <Button key={item.label} type="button" variant={'ghost'} className="w-full justify-start px-3">
                  <item.Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              )),
            )
            .with('icon', () =>
              menuItems.map((item) => (
                <Button key={item.label} type="button" variant={'ghost'} size={'icon'}>
                  <item.Icon className="h-4 w-4" />
                </Button>
              )),
            )
            .exhaustive()}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-4">
        {match(size)
          .with('default', () => <Skeleton className="h-6 w-full" />)
          .with('icon', () => (
            <Button type="button" variant={'ghost'} size={'icon'}>
              <Skeleton className="h-6 w-6" />
            </Button>
          ))
          .exhaustive()}

        {match(size)
          .with('default', () => (
            <Button type="button" variant={'ghost'} size={'lg'} className="w-full justify-start px-3">
              <Skeleton className="h-8 w-8 mr-3 rounded-full" />
              <Skeleton className="h-6 w-36" />
            </Button>
          ))
          .with('icon', () => (
            <Button type="button" variant={'ghost'} size={'icon'}>
              <Skeleton className="h-8 w-8" />
            </Button>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
