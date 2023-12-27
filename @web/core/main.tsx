import './global.css'
import { router } from './router'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { Toaster } from '@web/components/ui/toaster'
import { AuthProvider } from '@web/providers/auth'
import { QueryProvider } from '@web/providers/query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ScrollArea className="h-screen">
      <QueryProvider>
        <AuthProvider>
          <div className="h-screen">
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
      </QueryProvider>
    </ScrollArea>

    <Toaster />
  </React.StrictMode>,
)
