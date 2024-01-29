import { useAuthStore } from '@extension/stores/auth'
import { Logo } from '@web/components/logo'
import { Button } from '@web/components/ui/button'
import { env } from '@web/lib/env'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const authStore = useAuthStore()

  if (!authStore.state)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div>
          <button
            type="button"
            className="flex justify-center w-full"
            onClick={() => {
              chrome.tabs.create({ url: new URL(env.CONTENT_BASE_URL).toString() })
            }}
          >
            <span className="sr-only">Go Home Page</span>
            <Logo variant="icon" size={100} />
          </button>
          <div className="space-y-2 mt-4">
            <h2 className="text-2xl font-bold">Welcome to Our App</h2>
            <p className="text-muted-foreground text-center">Please sign in to continue</p>
          </div>
          <Button
            type="button"
            className="w-full mt-6"
            onClick={() => {
              chrome.tabs.create({ url: new URL('extension/sign-in', env.WEB_BASE_URL).toString() })
            }}
          >
            Sign in
          </Button>
        </div>
      </div>
    )

  return <Outlet />
}
