import { router } from '@api/trpc'
import { authEmailSendOtpRoute } from './email.send-otp'
import { authEmailValidateOtpRoute } from './email.validate-otp'
import { authInfosRoute } from './infos'
import { authLogoutRoute } from './logout'
import { authOauthAuthorizationUrlRoute } from './oauth.authorization-url'
import { authOauthConnectRoute } from './oauth.connect'
import { authOauthDisconnectRoute } from './oauth.disconnect'
import { authOauthLoginRoute } from './oauth.login'
import { authOrganizationSwitchRoute } from './organization-switch'
import { authProfileRouter } from './profile'

export const authRouter = router({
  email: router({
    sendOtp: authEmailSendOtpRoute,
    validateOtp: authEmailValidateOtpRoute,
  }),
  oauth: router({
    authorizationUrl: authOauthAuthorizationUrlRoute,
    login: authOauthLoginRoute,
    connect: authOauthConnectRoute,
    disconnect: authOauthDisconnectRoute,
  }),
  organization: router({
    switch: authOrganizationSwitchRoute,
  }),
  infos: authInfosRoute,
  profile: authProfileRouter,
  logout: authLogoutRoute,
})
