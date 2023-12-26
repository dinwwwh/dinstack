import { router } from './router'
import { AuthProvider } from '@auth-react/providers/auth'
import '@ui/styles/globals.css'
import { ScrollArea } from '@ui/ui/scroll-area'
import { Toaster } from '@ui/ui/toaster'
import { QueryProvider } from '@web/providers/query'
import { TurnstileProvider } from '@web/providers/turnstile'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ScrollArea className="h-screen">
    <React.StrictMode>
      <TurnstileProvider>
        <QueryProvider>
          <AuthProvider>
            <RouterProvider router={router} />

            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </TurnstileProvider>
    </React.StrictMode>
  </ScrollArea>,
)
