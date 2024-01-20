import { Button } from '@web/components/ui/button'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@web/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import * as React from 'react'

export function NavMobile(props: {
  children: React.ReactNode
  side: 'left' | 'right' | 'top' | 'bottom'
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <span className="sr-only">Open Sidebar Menu</span>
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={props.side} className="pr-0">
        <ScrollArea className="h-full">{props.children}</ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
