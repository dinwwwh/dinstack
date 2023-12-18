import { z } from 'zod'

export const authClientSchema = z.object({
  session: z.object({
    id: z.string(),
  }),
})
