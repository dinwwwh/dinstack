import { OrganizationSwitcher, SignOutButton, UserButton, UserProfile } from '@clerk/clerk-react'
import { Button } from '@web/components/ui/button'
import { api } from '@web/lib/api'
import { Helmet } from 'react-helmet-async'

export function Component() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div>
        <div className="h-screen p-6 space-y-8">
          <SignOutButton />

          <OrganizationSwitcher />

          <UserButton showName />
          <UserProfile />
        </div>
        <div className="h-screen bg-red-200"></div>
      </div>
    </>
  )
}
