import type { Subscriptions } from '@api/database/schema'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import { Button } from '@web/components/ui/button'
import { api } from '@web/lib/api'
import { env } from '@web/lib/env'
import { useAuthedStore } from '@web/stores/auth'
import { CheckIcon } from 'lucide-react'

const includedFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

export function Component() {
  const authStore = useAuthedStore()
  const subscription = authStore.session.user.subscriptions.find(
    (s) =>
      s.variantId === env.LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID &&
      (s.expiresAt?.getTime() || 0) <= Date.now(),
  )

  return (
    <main className="mt-6 md:mt-8 xl:mt-12">
      {subscription ? <PaidStatus subscription={subscription} /> : <UnpaidStatus />}
    </main>
  )
}

function PaidStatus(props: { subscription: typeof Subscriptions.$inferSelect }) {
  return (
    <div className="rounded-2xl border lg:mx-0 lg:flex">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl font-bold tracking-tight">Lifetime membership</h3>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          Enjoying a Lifetime of Membership! You locked in your membership on{' '}
          <span className="font-medium text-foreground/75">
            {props.subscription.createdAt.toDateString()}
          </span>
          . For any questions or concerns, please don&apos;t hesitate to contact us at{' '}
          <a
            href={`mailto:${env.SUPPORT_EMAIL}`}
            className="font-medium text-foreground/75 hover:text-foreground "
          >
            {env.SUPPORT_EMAIL}
          </a>
        </p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-primary">
            What&apos;s included
          </h4>
          <div className="h-px flex-auto bg-border" />
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2 sm:gap-6"
        >
          {includedFeatures.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <CheckIcon className="h-6 w-6 flex-none text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function UnpaidStatus() {
  return (
    <div className="rounded-2xl border lg:mx-0 lg:flex">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl font-bold tracking-tight">Lifetime membership</h3>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          Gain exclusive access and receive lifetime support with a{' '}
          <span className="font-medium text-foreground/75">14-day money-back guarantee</span>. For
          any questions or concerns, please don&apos;t hesitate to contact us at{' '}
          <a
            href={`mailto:${env.SUPPORT_EMAIL}`}
            className="font-medium text-foreground/75 hover:text-foreground "
          >
            {env.SUPPORT_EMAIL}
          </a>
        </p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-primary">
            What&apos;s included
          </h4>
          <div className="h-px flex-auto bg-border" />
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2 sm:gap-6"
        >
          {includedFeatures.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <CheckIcon className="h-6 w-6 flex-none text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
        <div className="rounded-xl bg-border/40 py-10 text-center lg:flex lg:flex-col lg:justify-center lg:py-16">
          <div className="mx-auto max-w-xs px-8">
            <p className="text-base font-semibold text-muted-foreground">
              Pay once, own it forever
            </p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-bold tracking-tight">$349</span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                USD
              </span>
            </p>
            <CheckoutButton />
            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              Invoices and receipts available for easy company reimbursement
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutButton() {
  const mutation = api.billing.checkout.useMutation({
    onSuccess(data) {
      if ('LemonSqueezy' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window.LemonSqueezy as any).Url.Open(data.checkoutUrl)
      } else {
        throw new Error('The LemonSqueezy payment platform is not available.')
      }
    },
  })

  return (
    <Button
      type="button"
      className="mt-10 w-full gap-2"
      onClick={() => {
        mutation.mutate({
          variantId: env.LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID,
          darkMode: document.documentElement.classList.contains('dark'),
        })
      }}
    >
      Get access <MutationStatusIcon status={mutation.status} />
    </Button>
  )
}
