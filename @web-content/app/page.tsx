'use client'

import { Button } from '+ui/ui/button'
import { api } from '@web-content/lib/api'

export default function Home() {
  const { status, data } = api.ping.useQuery()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>Xin chao</Button>
      {process.env.NEXT_PUBLIC_API_URL}
      <code className="text-2xl">
        {status} {JSON.stringify(data)}
      </code>
    </main>
  )
}
