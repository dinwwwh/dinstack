import { Logo } from '@web/components/logo'
import { Button } from '@web/components/ui/button'
import { Skeleton } from '@web/components/ui/skeleton'
import { useAuthStore } from '@web/stores/auth'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export function WithNavbarLayout() {
  return (
    <div>
      <nav className="p-3 border-b">
        <div className="flex justify-between items-center">
          <div>
            <Logo variant="icon" size={32} />
          </div>

          <div className="flex items-center">
            <Button variant={'ghost'} size={'icon'} className="h-8 w-8" asChild>
              <Link to="/settings">
                <SettingsIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant={'ghost'}
              size={'icon'}
              className="h-8 w-8"
              onClick={() => {
                useAuthStore.setState({ state: null })
              }}
            >
              <LogOutIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  )
}
