import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { LoadingScreen } from '@web/components/loading-screen'
import { CardContent } from '@web/components/ui/card'
import { env } from '@web/lib/env'
import { useSystemStore } from '@web/stores/system'
import { ComponentPropsWithoutRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

type Appearance = ComponentPropsWithoutRef<typeof ClerkProvider>['appearance']

const lightAppearance = {
  variables: {
    borderRadius: '0.3rem',
    colorText: 'hsl(224 71.4% 4.1%)',
    colorDanger: 'hsl(0 84.2% 60.2%)',
    colorPrimary: 'hsl(262.1 83.3% 57.8%)',
    colorTextOnPrimaryBackground: 'hsl(210 20% 98%)',
    colorBackground: 'hsl(0 0% 100%)',
    colorInputText: 'hsl(224 71.4% 4.1%)',
    colorTextSecondary: 'hsl(220 8.9% 46.1%)',
    colorInputBackground: 'hsl(0 0% 100%)',
  },
  elements: {
    cardBox: 'rounded-lg border bg-card text-card-foreground shadow-sm border-border',
  },
} satisfies Appearance

const darkAppearance = {
  baseTheme: dark,
  variables: {
    borderRadius: '0.3rem',
    colorText: 'hsl(210 20% 98%)',
    colorDanger: 'hsl(0 62.8% 30.6%)',
    colorPrimary: 'hsl(263.4 70% 50.4%)',
    colorTextOnPrimaryBackground: 'hsl(210 20% 98%)',
    colorBackground: 'hsl(224 71.4% 4.1%)',
    colorInputText: 'hsl(210 20% 98%)',
    colorTextSecondary: 'hsl(217.9 10.6% 64.9%)',
    colorInputBackground: 'hsl(224 71.4% 4.1%)',
  },
  elements: {
    cardBox: 'rounded-lg border bg-card text-card-foreground shadow-sm border-border',
  },
} satisfies Appearance

export function AuthProvider(props: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const theme = useSystemStore().theme

  const appearance = match(theme)
    .with('dark', () => darkAppearance)
    .with('light', () => lightAppearance)
    .with('system', () =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? darkAppearance : lightAppearance,
    )
    .exhaustive()

  return (
    <ClerkProvider
      publishableKey={env.CLERK_PUBLISHABLE_KEY}
      routerPush={navigate}
      routerReplace={navigate}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      appearance={appearance}
    >
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>

      <ClerkLoaded>{props.children}</ClerkLoaded>
    </ClerkProvider>
  )
}
