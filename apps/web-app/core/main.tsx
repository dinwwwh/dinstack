import { router } from './router'
import { AuthProvider } from '@auth-react/providers/auth'
import '@ui/styles/globals.css'
import { ScrollArea } from '@ui/ui/scroll-area'
import { Toaster } from '@ui/ui/toaster'
import { QueryProvider } from '@web-app/providers/query'
import { ThemeProvider } from '@web-app/providers/theme'
import { TurnstileProvider } from '@web-app/providers/turnstile'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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

    <Toaster />
  </React.StrictMode>,
)
