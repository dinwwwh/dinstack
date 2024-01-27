import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react'
import { LoadingScreen } from '@web/components/loading-screen'
import { env } from '@web/lib/env'
import { Loader2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AuthProvider(props: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <>
      <ClerkProvider
        publishableKey={env.CLERK_PUBLISHABLE_KEY}
        navigate={navigate}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      >
        <ClerkLoading>
          <LoadingScreen />
        </ClerkLoading>

        <ClerkLoaded>{props.children}</ClerkLoaded>
      </ClerkProvider>
    </>
  )
}
