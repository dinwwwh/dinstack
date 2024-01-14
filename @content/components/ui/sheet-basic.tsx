import { Sheet, SheetContent, SheetTrigger } from '@web/components/ui/sheet'
import * as React from 'react'

export function SheetBasic(props: {
  children: React.ReactNode
  side: 'left' | 'right' | 'top' | 'bottom'
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>active</SheetTrigger>
      <SheetContent side={props.side} className="pr-0">
        {props.children}
      </SheetContent>
    </Sheet>
  )
}
