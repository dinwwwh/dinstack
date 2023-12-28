import type * as _A from '@remix-run/router'
import { AuthLayout } from '@web/layouts/auth'
import { WithSidebarLayout } from '@web/layouts/with-sidebar'
import { ErrorPage } from '@web/pages/error'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        Component: () => <AuthLayout />,
        children: [
          {
            Component: () => <WithSidebarLayout />,
            children: [
              {
                path: '/',
                async lazy() {
                  const { HomePage } = await import('../pages/home')

                  return {
                    Component: HomePage,
                  }
                },
              },
            ],
          },
        ],
      },

      {
        path: '/oauth/:provider/callback',
        lazy: () => import('../pages/oauth-callback'),
      },
    ],
  },
])
