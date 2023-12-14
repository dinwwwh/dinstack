import type { Metadata } from 'next'
import { ScrollArea } from '@ui/ui/scroll-area'

export const metadata: Metadata = {
  title: 'Dashboard2',
}

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="h-screen p-10">Dash2</div>
      <div className="h-screen bg-green-200"></div>
    </ScrollArea>
  )
}
