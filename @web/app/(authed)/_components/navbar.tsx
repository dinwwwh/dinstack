'use client'

import { Button } from '@dinstack/ui/button'
import { ScrollArea } from '@dinstack/ui/scroll-area'
import { Skeleton } from '@dinstack/ui/skeleton'
import { DashboardIcon } from '@radix-ui/react-icons'

export function Navbar() {
  return (
    <div className="flex flex-col h-full">
      <Button type="button" variant={'ghost'} size={'lg'} className="w-full justify-start px-3">
        <Skeleton className="h-8 w-8 mr-3" />
        <Skeleton className="h-6 w-36" />
      </Button>

      <ScrollArea className="flex-1 mt-8">
        <div className="space-y-4">
          <Button type="button" variant={'ghost'} className="w-full justify-start px-3">
            <DashboardIcon className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
          <Button type="button" variant={'ghost'} className="w-full justify-start px-3">
            <DashboardIcon className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
          <Button type="button" variant={'ghost'} className="w-full justify-start px-3">
            <DashboardIcon className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
        </div>
      </ScrollArea>

      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />

        <Button type="button" variant={'ghost'} size={'lg'} className="w-full justify-start px-3">
          <Skeleton className="h-8 w-8 mr-3 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </Button>
      </div>
    </div>
  )
}
