import { AuthLayout } from '@web/layouts/auth'
import { WithSidebarLayout } from '@web/layouts/with-sidebar'
import { Route } from 'react-router-dom'

export const routes = (
  <>
    <Route element={<AuthLayout />}>
      <Route element={<WithSidebarLayout />}>
        <Route path="/" lazy={() => import('../pages/home')} />
      </Route>

      <Route path="/extension/login" lazy={() => import('../pages/extension-login')} />
    </Route>

    <Route path="/sign-in/*" lazy={() => import('../pages/sign-in')} />
    <Route path="/sign-up/*" lazy={() => import('../pages/sign-up')} />
  </>
)
