import { router } from '@api/trpc'
import { authGithubRouter } from './github'

export const authRouter = router({
  github: authGithubRouter,
})
