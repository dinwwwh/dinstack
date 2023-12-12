'use client'

import { Turnstile } from '@web/components/turnstile'
import { api } from '@web/lib/api'
import { Button } from '@ui/ui/button'

export default function Home() {
  const { status, data } = api.ping.useQuery()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        action={(e) => {
          console.log('submit')
        }}
      >
        <Turnstile />
        <Button>Submit</Button>
      </form>
    </main>
  )
}
