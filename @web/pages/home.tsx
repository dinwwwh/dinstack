import { Header } from '@web/components/navigation/header'
import { SubscriptionCard } from '@web/components/subscription-card'
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
          <SubscriptionCard />
        </section>
      </div>
    </>
  )
}
