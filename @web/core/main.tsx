import './global.css'
import { routes } from './routes'
import '@knocklabs/react/dist/index.css'
import { Toaster } from '@web/components/ui/sonner'
import { ErrorPage } from '@web/pages/error'
import { AuthProvider } from '@web/providers/auth'
import { PostHogProvider } from '@web/providers/post-hog'
import { QueryProvider } from '@web/providers/query'
import { ThemeProvider } from '@web/providers/theme'
import { TurnstileProvider } from '@web/providers/turnstile'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <AuthProvider>
          <PostHogProvider>
            <TurnstileProvider>
              <QueryProvider enablePostHog enableTurnstile>
                <Outlet />
              </QueryProvider>
            </TurnstileProvider>
          </PostHogProvider>
        </AuthProvider>
      }
      errorElement={<ErrorPage />}
    >
      {routes}
    </Route>,
  ),
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider context={{}}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>

    <Toaster pauseWhenPageIsHidden visibleToasts={5} richColors expand />
  </React.StrictMode>,
)
