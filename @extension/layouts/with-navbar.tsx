import { Logo } from '@web/components/logo'
import { Button } from '@web/components/ui/button'
import { env } from '@web/lib/env'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export function WithNavbarLayout() {
  return (
    <div>
      <nav className="px-3 py-2 border-b">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              chrome.tabs.create({ url: new URL(env.CONTENT_BASE_URL).toString() })
            }}
          >
            <span className="sr-only">Go Home Page</span>
            <Logo variant="icon" size={24} />
          </button>

          <div className="flex items-center gap-1">
            <Button variant={'ghost'} size={'icon'} className="size-7" asChild>
              <Link to="/settings">
                <span className="sr-only">Settings</span>
                <SettingsIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant={'ghost'}
              size={'icon'}
              className="size-7"
              onClick={() => {
                chrome.tabs.create({
                  url: new URL('extension/sign-out', env.WEB_BASE_URL).toString(),
                })
              }}
            >
              <span className="sr-only">Sign Out</span>
              <LogOutIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  )
}
