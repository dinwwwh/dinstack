import { router } from '@api/trpc'
import { authEmailRouter } from './email'
import { authGithubRouter } from './github'
import { authGoogleRouter } from './google'
import { authInfosRoute } from './infos'
import { authOrganizationSwitchRoute } from './organization-switch'

export const authRouter = router({
  google: authGoogleRouter,
  email: authEmailRouter,
  github: authGithubRouter,
  organization: router({
    switch: authOrganizationSwitchRoute,
  }),
  infos: authInfosRoute,
})
