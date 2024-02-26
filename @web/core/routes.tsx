import { AuthLayout } from '@web/layouts/auth'
import { WithSidebarLayout } from '@web/layouts/with-sidebar'
import { Route } from 'react-router-dom'

export const routes = (
  <Route>
    <Route element={<AuthLayout />}>
      <Route element={<WithSidebarLayout />}>
        <Route path="/" lazy={() => import('../pages/home')} />
      </Route>

      <Route path="/extension/sign-in" lazy={() => import('../pages/extension-sign-in')} />
      <Route path="/extension/sign-out" lazy={() => import('../pages/extension-sign-out')} />
    </Route>

    <Route path="/sign-in/*" lazy={() => import('../pages/sign-in')} />
    <Route path="/sign-up/*" lazy={() => import('../pages/sign-up')} />
  </Route>
)
