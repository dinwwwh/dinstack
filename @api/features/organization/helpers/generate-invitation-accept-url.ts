import { Context } from '@api/context'

export function generateInvitationAcceptUrl({
  ctx,
  invitationSecretKey,
}: {
  ctx: Context
  invitationSecretKey: string
}) {
  return new URL(`/invitation-accept?secret-key=${invitationSecretKey}`, ctx.env.WEB_URL)
}
