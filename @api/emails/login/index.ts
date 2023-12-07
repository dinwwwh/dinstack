import template from './template.html'

export function generateLoginEmail({ otp }: { otp: string }) {
  const html = template.replaceAll('{{OTP}}', otp)
  const subject = 'OTP to complete the login process'

  return {
    html,
    subject,
  }
}
