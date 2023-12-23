'use client'

import { Button } from '+ui/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '+ui/ui/sheet'
import { Skeleton } from '+ui/ui/skeleton'
import { Navbar } from './_navbar'
import { RequireAuthWrapper } from './_require-auth'
import { CaretLeftIcon, CaretRightIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { sidebarSizeHistoryAtom } from '@web/atoms/history'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { match } from 'ts-pattern'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuthWrapper>
      <div className="md:h-full md:flex">
        <SmallScreenNavbar />
        <LargeScreenNavbar />
        <div className="md:flex-1 md:h-full">{children}</div>
      </div>
    </RequireAuthWrapper>
  )
}

function SmallScreenNavbar() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="px-4 py-3 md:hidden flex justify-between gap-4 border-b  border-border/50">
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button type="button" variant={'outline'} size={'icon'}>
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'} className="min-w-[288px]">
          <Navbar onNavigate={() => setIsMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-9 w-9" />
    </div>
  )
}

function LargeScreenNavbar() {
  const [sidebarSize, setSidebarSize] = useAtom(sidebarSizeHistoryAtom)

  return (
    <div className="h-full p-4 pb-6 relative z-10 hidden md:block bg-border/10 border-r  border-border/50">
      <motion.div
        className="h-full"
        initial={{ width: sidebarSize === 'default' ? 288 : 36 }}
        animate={{ width: sidebarSize === 'default' ? 288 : 36 }}
      >
        <Navbar />
      </motion.div>

      <div className="absolute top-2 -right-3">
        {match(sidebarSize)
          .with('default', () => (
            <Button
              type="button"
              variant={'outline'}
              size={'icon'}
              className="h-6 w-6 bg-background"
              onClick={() => setSidebarSize('icon')}
            >
              <CaretLeftIcon className="h-4 w-4" />
            </Button>
          ))
          .with('icon', () => (
            <Button
              type="button"
              variant={'outline'}
              size={'icon'}
              className="h-6 w-6 bg-background"
              onClick={() => setSidebarSize('default')}
            >
              <CaretRightIcon className="h-4 w-4" />
            </Button>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
