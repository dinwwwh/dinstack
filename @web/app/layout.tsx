import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@ui/styles/globals.css'
import { ScrollArea } from '@ui/ui/scroll-area'
import { Toaster } from '@ui/ui/toaster'
import { JotaiProvider } from './_jotai-provider'
import { QueryProvider } from './_query-provider'
import { ThemeProvider } from './_theme-provider'
import { TurnstileProvider } from './_turnstile-provider'

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
              <TurnstileProvider>
                <ScrollArea>
                  <div className="h-screen">{children}</div>
                </ScrollArea>
              </TurnstileProvider>
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
