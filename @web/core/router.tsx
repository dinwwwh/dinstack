import type * as _A from '@remix-run/router'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    async lazy() {
      const { HomePage } = await import('../pages/home')

      return {
        Component: HomePage,
      }
    },
  },
])
