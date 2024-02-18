import { Header } from '@web/components/navigation/header'
import { SubscriptionCard } from '@web/components/subscription-card'
import { Button } from '@web/components/ui/button'
import { trpc } from '@web/lib/trpc'
import { Helmet } from 'react-helmet-async'

export function Component() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="container max-w-5xl">
        <div className="py-6">
          <Header />
        </div>

        <section className="mt-6 md:mt-8 xl:mt-12">
          <div className="rounded-2xl border lg:mx-0 ">
            <SubscriptionCard />
          </div>
        </section>

        <TestMutation />

        <TestNotification />
      </div>
    </>
  )
}

function TestMutation() {
  const query = trpc.ping.useQuery()
  const mutation = trpc.pingMutation.useMutation()

  return (
    <section className="mt-6 ">
      <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
        Mutate
      </Button>
      <span className="ml-4">{query.data}</span>
    </section>
  )
}

function TestNotification() {
  const mutation = trpc.notification.test.useMutation()

  return (
    <section className="mt-6 ">
      <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
        Test Notification
      </Button>
    </section>
  )
}
