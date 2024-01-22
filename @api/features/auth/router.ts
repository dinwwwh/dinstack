import { authEmailLoginRoute } from './email.login'
import { authEmailSendOtpRoute } from './email.send-otp'
import { authInfosRoute } from './infos'
import { authLogoutRoute } from './logout'
import { authLogoutOtherDevicesRoute } from './logout-other-devices'
import { authNotificationPushPostTestRoute } from './notification.push.post-test'
import { authNotificationPushRegisterRoute } from './notification.push.register'
import { authOauthAuthorizationUrlRoute } from './oauth.authorization-url'
import { authOauthConnectRoute } from './oauth.connect'
import { authOauthDisconnectRoute } from './oauth.disconnect'
import { authOauthInfosRoute } from './oauth.infos'
import { authOauthLoginRoute } from './oauth.login'
import { authOrganizationSwitchRoute } from './organization-switch'
import { authProfileRouter } from './profile'
import { router } from '@api/core/trpc'

export const authRouter = router({
  email: router({
    sendOtp: authEmailSendOtpRoute,
    login: authEmailLoginRoute,
  }),
  oauth: router({
    authorizationUrl: authOauthAuthorizationUrlRoute,
    login: authOauthLoginRoute,
    connect: authOauthConnectRoute,
    disconnect: authOauthDisconnectRoute,
    infos: authOauthInfosRoute,
  }),
  organization: router({
    switch: authOrganizationSwitchRoute,
  }),
  infos: authInfosRoute,
  profile: authProfileRouter,
  logout: authLogoutRoute,
  logoutOtherDevices: authLogoutOtherDevicesRoute,
  notification: router({
    push: router({
      register: authNotificationPushRegisterRoute,
      postTest: authNotificationPushPostTestRoute,
    }),
  }),
})
