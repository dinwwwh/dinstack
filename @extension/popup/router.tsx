import type * as _A from '@remix-run/router'
import { createMemoryRouter } from 'react-router-dom'

export const router = createMemoryRouter([
  {
    // TODO: implement error boundary
    errorElement: <div>Error!</div>,
    children: [
      {
        path: '/',
        lazy: () => import('./pages/home'),
      },
    ],
  },
])
