import './global.css'
import { router } from './router'
import '@ui/styles/globals.css'
import { Toaster } from '@web/components/ui/toaster'
import { QueryProvider } from '@web/providers/query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>

    <Toaster />
  </React.StrictMode>,
)
