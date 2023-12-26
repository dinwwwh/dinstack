import { router } from './router'
import '@ui/styles/globals.css'
import { ScrollArea } from '@ui/ui/scroll-area'
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
          <RouterProvider router={router} />
        </QueryProvider>
      </TurnstileProvider>
    </React.StrictMode>
  </ScrollArea>,
)
