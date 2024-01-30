import type { ContextWithoutRequest } from './context'
import { expectType } from 'ts-expect'
import { z } from 'zod'

const authSchema = z
  .object({
    userId: z.string(),
  })
  .and(
    z
      .object({
        organizationId: z.undefined(),
        organizationRole: z.undefined(),
      })
      .or(
        z.object({
          organizationId: z.string(),
          organizationRole: z.enum(['org:admin', 'org:member']),
        }),
      ),
  )

export type Auth = z.infer<typeof authSchema>

export async function authenticateRequestToAuth(opts: {
  request: Request
  ctx: ContextWithoutRequest
}) {
  const requestState = await opts.ctx.clerk.authenticateRequest({
    request: opts.request,
  })

  if (!requestState.isSignedIn) return null

  const authClerk = requestState.toAuth()

  try {
    const raw = {
      userId: authClerk?.userId,
      organizationId: authClerk?.orgId,
      organizationRole: authClerk?.orgRole,
    }

    expectType<Record<keyof z.infer<typeof authSchema>, unknown>>(raw)

    return authSchema.parse(raw)
  } catch (e) {
    console.error(e)

    return null
  }
}
