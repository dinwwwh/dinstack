import template from './template.html'

export function generateOrganizationInvitationEmail(data: {
  inviterName: string
  organizationName: string
  invitationAcceptUrl: string
}) {
  const html = template
    .replaceAll('{{INVITER_NAME}}', data.inviterName)
    .replaceAll('{{ORGANIZATION_NAME}}', data.organizationName)
    .replaceAll('{{INVITATION_ACCEPT_URL}}', data.invitationAcceptUrl)
  const subject = 'You have been invited to join an organization'

  return {
    html,
    subject,
  }
}
