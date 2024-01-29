import {
  OrganizationSwitcher,
  SignOutButton,
  UserButton,
  UserProfile,
  useAuth,
} from '@clerk/clerk-react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Logo } from '@web/components/logo'
import { Header } from '@web/components/navigation/header'
import { LogoDropdownMenu } from '@web/components/navigation/logo-dropdown-menu'
import { Button } from '@web/components/ui/button'
import { api } from '@web/lib/api'
import { cn } from '@web/lib/utils'
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

        <div className="h-screen p-6 space-y-8 bg-green-200"></div>
        <div className="h-screen bg-red-200"></div>
        <div className="h-screen "></div>
      </div>
    </>
  )
}
