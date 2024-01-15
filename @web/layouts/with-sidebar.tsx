'use client'

import { Button } from '@ui/components/ui/button'
import { ScrollArea } from '@ui/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@ui/components/ui/sheet'
import { Skeleton } from '@ui/components/ui/skeleton'
import { Navbar } from '@web/components/navigation/sidebar'
import { useSystemStore } from '@web/stores/system'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MenuIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { match } from 'ts-pattern'

export function WithSidebarLayout() {
  return (
    <div className="md:h-full md:flex">
      <SmallScreenNavbar />
      <LargeScreenNavbar />
      <ScrollArea className="md:flex-1 md:h-full">
        <Outlet />
      </ScrollArea>
    </div>
  )
}

function SmallScreenNavbar() {
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [location])

  return (
    <div className="px-4 py-3 md:hidden flex justify-between gap-4 border-b  border-border/50">
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button type="button" variant={'outline'} size={'icon'}>
            <MenuIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'} className="min-w-[288px]">
          <Navbar />
        </SheetContent>
      </Sheet>

      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-9 w-9" />
    </div>
  )
}

function LargeScreenNavbar() {
  const sidebarSize = useSystemStore().sidebarSize

  return (
    <div className="h-full p-4 px-3 pb-6 relative z-10 hidden md:block border-r border-border/50">
      <motion.div
        className="h-full"
        initial={{ width: sidebarSize === 'default' ? 288 : 36 }}
        animate={{ width: sidebarSize === 'default' ? 288 : 36 }}
      >
        <Navbar />
      </motion.div>

      <div className="absolute top-2 -right-2.5">
        {match(sidebarSize)
          .with('default', () => (
            <Button
              type="button"
              variant={'outline'}
              size={'icon'}
              className="h-5 w-5 bg-background"
              onClick={() => useSystemStore.setState({ sidebarSize: 'icon' })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ))
          .with('icon', () => (
            <Button
              type="button"
              variant={'outline'}
              size={'icon'}
              className="h-5 w-5 bg-background"
              onClick={() => useSystemStore.setState({ sidebarSize: 'default' })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
