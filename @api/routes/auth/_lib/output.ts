import { organizationMembersRoles } from '@api/database/schema'
import { z } from 'zod'

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url(),
})

// TODO: move to shared @api and @web
export const authOutputSchema = z.object({
  auth: z.object({
    user: userSchema,
    organizationMember: z.object({
      role: z.enum(organizationMembersRoles.enumValues),
      organization: z.object({
        id: z.string().uuid(),
        name: z.string(),
        logoUrl: z.string().url(),
      }),
    }),
    jwt: z.string(),
  }),
})
