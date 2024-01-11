import { AuthLayout } from '@extension/layouts/auth'
import { WithNavbarLayout } from '@extension/layouts/with-navbar'
import type * as _A from '@remix-run/router'
import { createMemoryRouter } from 'react-router-dom'

export const router = createMemoryRouter([
  {
    // TODO: implement error boundary
    errorElement: <div>Error!</div>,
    children: [
      {
        Component: () => <AuthLayout />,
        children: [
          {
            Component: () => <WithNavbarLayout />,
            children: [
              {
                path: '/',
                lazy: () => import('./pages/home'),
              },
            ],
          },
        ],
      },
    ],
  },
])
