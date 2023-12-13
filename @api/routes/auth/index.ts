import { router } from '@api/trpc'
import { authEmailRouter } from './email'
import { authInfosRoute } from './infos'
import { authOauthRouter } from './oauth'
import { authOrganizationSwitchRoute } from './organization-switch'
import { authProfileRouter } from './profile'

export const authRouter = router({
  email: authEmailRouter,
  oauth: authOauthRouter,
  organization: router({
    switch: authOrganizationSwitchRoute,
  }),
  infos: authInfosRoute,
  profile: authProfileRouter,
})
