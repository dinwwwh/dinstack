'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Logo } from '@web/components/logo'
import { LogoDropdownMenu } from '@web/components/navigation/logo-dropdown-menu'
import { Navbar } from '@web/components/navigation/sidebar'
import { Button } from '@web/components/ui/button'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@web/components/ui/sheet'
import { Skeleton } from '@web/components/ui/skeleton'
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
    <div className="relative px-4 py-3 md:hidden flex justify-between gap-4 border-b  border-border/50">
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button type="button" variant={'outline'} size={'icon'}>
            <span className="sr-only">Open Sidebar Menu</span>
            <MenuIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'} className="min-w-[288px]">
          <Navbar />
        </SheetContent>
      </Sheet>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <LogoDropdownMenu>
          <DropdownMenuTrigger>
            <span className="sr-only">Open Main Menu</span>
            <Logo variant="icon" size={32} />
          </DropdownMenuTrigger>
        </LogoDropdownMenu>
      </div>
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
        initial={{ width: sidebarSize === 'default' ? 288 : 32 }}
        animate={{ width: sidebarSize === 'default' ? 288 : 32 }}
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
              <span className="sr-only">Collapse sidebar</span>
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
              <span className="sr-only">Uncollapse sidebar</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
