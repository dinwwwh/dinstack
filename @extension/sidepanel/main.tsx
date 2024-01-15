import '../init'
import { router } from './router'
import { ScrollArea } from '@ui/components/ui/scroll-area'
import { Toaster } from '@ui/components/ui/toaster'
import '@web/core/global.css'
import { AuthProvider } from '@web/providers/auth'
import { QueryProvider } from '@web/providers/query'
import { ThemeProvider } from '@web/providers/theme'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* TODO: enable turnstile when it support chrome extension */}
      <QueryProvider disableTurnstile={true}>
        <AuthProvider>
          <ScrollArea className="h-screen">
            <RouterProvider router={router} />
          </ScrollArea>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>

    <Toaster />
  </React.StrictMode>,
)
