import { AuthProvider } from './_providers/auth'
import JotaiProvider from './_providers/jotai'
import { QueryProvider } from './_providers/query'
import { ThemeProvider } from './_providers/theme'
import TurnstileProvider from './_providers/turnstile'
import '@ui/styles/globals.css'
import { ScrollArea } from '@ui/ui/scroll-area'
import { Toaster } from '@ui/ui/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'DinstackDDD',
    template: '%s | Dinstack',
  },
  description: 'Powerful your next project with Dinstack',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <JotaiProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <QueryProvider>
              <AuthProvider>
                <TurnstileProvider>
                  <ScrollArea>
                    <div className="h-screen">{children}</div>
                  </ScrollArea>
                </TurnstileProvider>
                <Toaster />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
