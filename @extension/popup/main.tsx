import '../init'
import { router } from './router'
import { QueryProvider } from '@extension/providers/query'
import '@web/core/global.css'
import { AuthProvider } from '@web/providers/auth'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>,
)
