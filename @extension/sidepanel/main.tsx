import '../init'
import { router } from './router'
import { QueryProvider } from '@extension/providers/query'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { Toaster } from '@web/components/ui/sonner'
import '@web/core/global.css'
import { ThemeProvider } from '@web/providers/theme'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* TODO: enable turnstile when it support chrome extension */}
      <QueryProvider>
        <ScrollArea className="h-screen">
          <RouterProvider router={router} />
        </ScrollArea>
      </QueryProvider>
    </ThemeProvider>

    <Toaster richColors />
  </React.StrictMode>,
)
