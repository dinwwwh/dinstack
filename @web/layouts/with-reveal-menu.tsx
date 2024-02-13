import { RevealMenu } from '@web/components/navigation/reveal-menu'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export function WithRevealMenuLayout() {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const revealMenuRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    if (!revealMenuRef.current) return
    const outer = containerRef.current.childNodes[1] as HTMLDivElement | undefined
    if (!outer) return

    outer.scrollTo({
      top: revealMenuRef.current.clientHeight,
      behavior: 'instant',
    })
  }, [location])

  return (
    <div>
      <ScrollArea ref={containerRef} className="h-screen">
        <div ref={revealMenuRef} className="border-b border-border/40">
          <div className="container">
            <RevealMenu showNotificationButton />
          </div>
        </div>
        <div className="min-h-screen pb-8">
          <Outlet />
        </div>
        <div className="container">
          <RevealMenu />
        </div>
      </ScrollArea>
    </div>
  )
}
