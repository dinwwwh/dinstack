import type * as _A from '@remix-run/router'
import { AuthLayout } from '@web-app/layouts/auth-layout'
import { WithSidebar } from '@web-app/layouts/with-sidebar'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    Component: () => <AuthLayout />,
    children: [
      {
        Component: () => <WithSidebar />,
        children: [
          {
            path: '/',
            lazy: () => import('../pages/home'),
          },
          {
            path: '/profile',
            lazy: () => import('../pages/profile'),
          },
        ],
      },
    ],
  },
  {
    path: '/oauth/:provider/callback',
    lazy: () => import('../pages/oauth-callback'),
  },
])
