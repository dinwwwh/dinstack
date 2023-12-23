import { organizationChangeLogoRoute } from './change-logo'
import { organizationCreateRoute } from './create'
import { organizationDetailRoute } from './detail'
import { organizationListRoute } from './list'
import { organizationMemberAcceptInvitationRoute } from './member.accept-invitation'
import { organizationMemberInvitationInfoRoute } from './member.invitation-info'
import { organizationMemberInviteRoute } from './member.invite'
import { organizationMemberRemoveRoute } from './member.remove'
import { organizationUpdateRoute } from './update'
import { router } from '@api/core/trpc'

export const organizationRouter = router({
  list: organizationListRoute,
  detail: organizationDetailRoute,
  create: organizationCreateRoute,
  update: organizationUpdateRoute,
  changeLogo: organizationChangeLogoRoute,
  member: router({
    invite: organizationMemberInviteRoute,
    invitationInfo: organizationMemberInvitationInfoRoute,
    acceptInvitation: organizationMemberAcceptInvitationRoute,
    remove: organizationMemberRemoveRoute,
  }),
})
