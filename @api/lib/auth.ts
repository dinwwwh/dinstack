import { ContextWithoutRequest } from './context'
import { expectType } from 'ts-expect'
import 'type-fest'
import { z } from 'zod'

const authSchema = z
  .object({
    userId: z.string(),
  })
  .and(
    z
      .object({
        organizationId: z.null(),
        organizationRole: z.null(),
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

  const authClerk = requestState.toAuth()
  const claims = authClerk?.sessionClaims

  if (!claims) return null

  try {
    const raw = {
      userId: claims.sub,
      organizationId: claims.org_id,
      organizationRole: claims.org_role,
    }

    expectType<Record<keyof z.infer<typeof authSchema>, any>>(raw)

    return authSchema.parse(raw)
  } catch {
    return null
  }
}
