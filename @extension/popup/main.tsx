import '../init'
import { router } from './router'
import { QueryProvider } from '@extension/providers/query'
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
        <RouterProvider router={router} />
      </QueryProvider>
    </ThemeProvider>

    <Toaster position="top-right" richColors />
  </React.StrictMode>,
)
