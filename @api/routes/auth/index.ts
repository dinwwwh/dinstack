import { router } from '@api/trpc'
import { authEmailRouter } from './email'
import { authGithubRouter } from './github'
import { authGoogleRouter } from './google'

export const authRouter = router({
  google: authGoogleRouter,
  email: authEmailRouter,
  github: authGithubRouter,
})
