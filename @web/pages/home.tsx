import { Header } from '@web/components/navigation/header'
import { SubscriptionCard } from '@web/components/subscription-card'
import { Button } from '@web/components/ui/button'
import { api } from '@web/lib/api'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'

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
          <SubscriptionCard />
        </section>

        <TestMutation />
      </div>
    </>
  )
}

function TestMutation() {
  const mutation = api.pingMutation.useMutation({
    onMutate() {
      toast.error('huhu')
    },
  })

  return (
    <section className="mt-6">
      <Button onClick={() => mutation.mutate()}>Mutate</Button>
    </section>
  )
}
