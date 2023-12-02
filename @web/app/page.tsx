'use client'

import { api } from '@web/lib/api'

export default function Home() {
  const { status, data } = api.ping.useQuery()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {process.env.NEXT_PUBLIC_API_URL}
      <code className="text-2xl">
        {status} {JSON.stringify(data)}
      </code>
    </main>
  )
}
