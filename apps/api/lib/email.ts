import type { Env } from '@api/env'

export function createSendEmailFn({ env }: { env: Env }) {
  return async (arg: { to: string[]; subject: string; html: string }) => {
    return await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: arg.to,
        subject: arg.subject,
        html: arg.html,
      }),
    })
  }
}
