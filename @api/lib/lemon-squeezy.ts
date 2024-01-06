import type { Env } from './env'
import { LemonSqueezy } from '@lemonsqueezy/lemonsqueezy.js'
import { Buffer } from 'node:buffer'
import { z } from 'zod'

const encoder = new TextEncoder()

export function createLemonSqueezy({ env }: { env: Env }) {
  return new LemonSqueezy(env.LEMONSQUEEZY_API_KEY)
}

export async function verifyWebhookRequest({ env, request }: { env: Env; request: Request }) {
  const dataText = await request.clone().text()
  const data = encoder.encode(dataText)
  const signature = Buffer.from(request.headers.get('X-Signature') || '', 'hex')
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.LEMONSQUEEZY_WEBHOOK_SIGNING_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )

  const verified = await crypto.subtle.verify('HMAC', key, signature, data)

  if (!verified) {
    return false
  }

  const dataJson = z
    .object({
      meta: z.object({
        test_mode: z.boolean(),
      }),
    })
    .parse(JSON.parse(dataText))

  if (env.WORKER_ENV !== 'development' && dataJson['meta']['test_mode'] === true) {
    return false
  }

  return true
}
