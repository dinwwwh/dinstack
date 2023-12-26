import type * as _A from '@remix-run/router'
import { AuthLayout } from '@web/components/auth-layout'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    Component: () => <AuthLayout />,
    children: [
      {
        path: '/',
        lazy: () => import('../pages/home'),
      },
    ],
  },
  {
    path: '/oauth/:provider/callback',
    lazy: () => import('../pages/oauth-callback'),
  },
])
