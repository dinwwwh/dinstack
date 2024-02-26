import './global.css'
import { routes } from './routes'
import '@knocklabs/react/dist/index.css'
import { ScrollArea } from '@web/components/ui/scroll-area'
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
        <ScrollArea className="h-screen">
          <div className="h-screen">
            <RouterProvider router={router} />
          </div>
        </ScrollArea>
      </ThemeProvider>
    </HelmetProvider>

    <Toaster pauseWhenPageIsHidden visibleToasts={5} richColors expand />
  </React.StrictMode>,
)
