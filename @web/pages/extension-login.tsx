import { Button } from '@web/components/ui/button'
import { useEffectOnce } from '@web/hooks/use-effect-once'
import { env } from '@web/lib/env'
import { useAuthedStore } from '@web/stores/auth'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <div>
            <p className="text-muted-foreground text-sm">
              You have successfully logged in to the browser extensions. You may now safely close
              this tab.
            </p>
            <div className="flex justify-center">
              <Button variant={'link'} asChild>
                <Link to="/" className="text-muted-foreground text-sm text-center">
                  Go to home page
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <Loader2Icon className="h-10 w-10 animate-spin text-muted-foreground" />
        )}
      </div>
    </>
  )
}
