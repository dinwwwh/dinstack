import { Button } from '@ui/components/ui/button'
import { env } from '@web/lib/env'
import { useAuthStore } from '@web/stores/auth'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const authStore = useAuthStore()

  if (!authStore.state)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div>
          <div className="flex justify-center">
            <img
              alt="Logo"
              className="dark:hidden"
              height="100"
              src="/icon-128.png"
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              width="100"
            />
            <img
              alt="Logo"
              className="hidden dark:block"
              height="100"
              src="/icon-128-dark.png"
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              width="100"
            />
          </div>
          <div className="space-y-2 mt-4">
            <h2 className="text-2xl font-bold">Welcome to Our App</h2>
            <p className="text-muted-foreground text-center">Please login to continue</p>
          </div>
          <Button
            type="button"
            className="w-full mt-6"
            onClick={() => {
              chrome.tabs.create({ url: new URL('extension/login', env.WEB_BASE_URL).toString() })
            }}
          >
            Login
          </Button>
        </div>
      </div>
    )

  return <Outlet />
}
