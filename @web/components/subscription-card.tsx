import type { Subscription } from '@api/lib/subscription'
import { Button } from '@web/components/ui/button'
import { useLifetimeAccessSubscription } from '@web/hooks/use-lifetime-access-subscription'
import type { Tenant } from '@web/lib/auth'
import { useTenant } from '@web/lib/auth'
import { env } from '@web/lib/env'
import { trpc } from '@web/lib/trpc'
import { CheckIcon } from 'lucide-react'
import { match } from 'ts-pattern'

// TODO: fill these features
const personalFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

const teamFeatures = [...personalFeatures, 'Unlimited members']

export function SubscriptionCard() {
  const tenant = useTenant()

  const subscription = useLifetimeAccessSubscription()

  return (
    <div>
      {subscription ? (
        <PaidStatus subscription={subscription} type={tenant.type} />
      ) : (
        <UnpaidStatus type={tenant.type} />
      )}
    </div>
  )
}

function PaidStatus(props: { subscription: Subscription; type: Tenant['type'] }) {
  const features = match(props.type)
    .with('user', () => personalFeatures)
    .with('organization', () => teamFeatures)
    .exhaustive()

  const title = match(props.type)
    .with('user', () => 'Lifetime Access (Personal)')
    .with('organization', () => 'Lifetime Access (Team)')
    .exhaustive()

  return (
    <div className="lg:flex">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          Enjoying the lifetime Access, which was unlocked on{' '}
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
          {features.map((feature) => (
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

function UnpaidStatus(props: { type: Tenant['type'] }) {
  const features = match(props.type)
    .with('user', () => personalFeatures)
    .with('organization', () => teamFeatures)
    .exhaustive()

  const title = match(props.type)
    .with('user', () => 'Lifetime Access (Personal)')
    .with('organization', () => 'Lifetime Access (Team)')
    .exhaustive()

  return (
    <div className="lg:flex">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
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
          {features.map((feature) => (
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
              <span className="text-5xl font-bold tracking-tight">
                {match(props.type)
                  .with('user', () => '$9.9')
                  .with('organization', () => '$28.9')
                  .exhaustive()}
              </span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                USD
              </span>
            </p>
            <CheckoutButton type={props.type} />
            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              Invoices and receipts available for easy company reimbursement
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutButton(props: { type: Tenant['type'] }) {
  const mutation = trpc.billing.checkout.useMutation({
    onSuccess(data) {
      if ('LemonSqueezy' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window.LemonSqueezy as any).Url.Open(data.checkoutUrl)
      } else {
        throw new Error('The LemonSqueezy payment platform is not available.')
      }
    },
  })

  const variantId = match(props.type)
    .with('user', () => env.LEMONSQUEEZY_PERSONAL_LIFETIME_ACCESS_VARIANT_ID)
    .with('organization', () => env.LEMONSQUEEZY_TEAM_LIFETIME_ACCESS_VARIANT_ID)
    .exhaustive()

  return (
    <Button
      type="button"
      className="mt-10 w-full gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate({
          variantId,
          darkMode: document.documentElement.classList.contains('dark'),
        })
      }}
    >
      Get access
    </Button>
  )
}
