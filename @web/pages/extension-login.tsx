import { useEffectOnce } from '@web/hooks/use-effect-once'
import { env } from '@web/lib/env'
import { useAuthedStore } from '@web/stores/auth'
import { Chrome, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SuperJSON from 'superjson'

export function Component() {
  const [done, setDone] = useState(false)
  const auth = useAuthedStore()

  useEffectOnce(() => {
    if (!('chrome' in window)) {
      throw new Error(
        "This feature needs a browser setting that isn't available here. It might work better in Chrome.",
      )
    }

    if (
      typeof window.chrome !== 'object' ||
      window.chrome === null ||
      !('runtime' in window.chrome)
    ) {
      throw new Error(
        "To use this feature, please install the browser extension. It's quick and easy!",
      )
    }

    ;(window.chrome.runtime as any).sendMessage(env.EXTENSION_ID, {
      type: 'login',
      data: SuperJSON.stringify({ auth: auth.state }),
    })

    setDone(true)
  })

  return (
    <>
      <Helmet>
        <title>Extension Login</title>
      </Helmet>

      <div className="flex items-center justify-center h-full">
        {done ? (
          <p className="text-muted-foreground text-sm">
            You have successfully logged in to the browser extensions. You may now safely close this
            tab.
          </p>
        ) : (
          <Loader2Icon className="h-10 w-10 animate-spin text-muted-foreground" />
        )}
      </div>
    </>
  )
}
