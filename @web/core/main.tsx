import './global.css'
import { router } from './router'
import { ScrollArea } from '@ui/components/ui/scroll-area'
import { Toaster } from '@ui/components/ui/toaster'
import { AuthProvider } from '@web/providers/auth'
import { QueryProvider } from '@web/providers/query'
import { ThemeProvider } from '@web/providers/theme'
import { TurnstileProvider } from '@web/providers/turnstile'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider context={{}}>
      <ThemeProvider>
        <ScrollArea className="h-screen">
          <TurnstileProvider>
            <QueryProvider>
              <AuthProvider>
                <div className="h-screen">
                  <RouterProvider router={router} />
                </div>
              </AuthProvider>
            </QueryProvider>
          </TurnstileProvider>
        </ScrollArea>
      </ThemeProvider>
    </HelmetProvider>

    <Toaster />
  </React.StrictMode>,
)
