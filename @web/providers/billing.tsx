import { SubscriptionCard } from '@web/components/subscription-card'
import { Dialog, DialogContent } from '@web/components/ui/dialog'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { useLifetimeAccessSubscription } from '@web/hooks/use-lifetime-access-subscription'
import { useListenToTRPCMutation } from '@web/hooks/use-listen-to-trpc-mutation'
import { useTenant } from '@web/lib/auth'
import { trpc } from '@web/lib/trpc'
import { useEffect, useRef, useState } from 'react'

export function BillingProvider(props: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const lastCheckoutAt = useRef<Date | null>(null)

  useListenToTRPCMutation(trpc.billing.checkout, {
    onSuccess() {
      lastCheckoutAt.current = new Date()
      setOpen(false)
    },
  })

  const subscription = useLifetimeAccessSubscription()
  const tenant = useTenant()

  useEffect(() => {
    if (subscription) return

    const id = window.setInterval(() => {
      if (lastCheckoutAt.current && lastCheckoutAt.current.getTime() > Date.now() - 1000 * 60 * 5) {
        return
      }

      if (tenant.createdAt && tenant.createdAt.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 7) {
        return
      }

      setOpen(true)
    }, 1000 * 60)

    return () => {
      window.clearInterval(id)
    }
  }, [subscription, tenant])

  return (
    <>
      {props.children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-6xl max-h-screen overflow-auto flex">
          <ScrollArea className="flex-1 pt-8">
            <SubscriptionCard />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
