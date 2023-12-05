import { router } from '@api/trpc'
import { authGoogleRouter } from './google'

export const authRouter = router({
  google: authGoogleRouter,
})
