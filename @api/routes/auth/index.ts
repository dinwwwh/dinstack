import { router } from '@api/trpc'
import { authEmailRouter } from './email'
import { authGoogleRouter } from './google'

export const authRouter = router({
  google: authGoogleRouter,
  email: authEmailRouter,
})
