import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const redirectUrl =
    window.location.pathname === '/extension/sign-out' ? '/' : window.location.href

  return (
    <>
      <SignedOut>
        <RedirectToSignIn
          redirectUrl={redirectUrl}
          afterSignUpUrl={redirectUrl}
          afterSignInUrl={redirectUrl}
          afterSignOutUrl={redirectUrl}
        />
      </SignedOut>
      <SignedIn>
        <Outlet />
      </SignedIn>
    </>
  )
}
