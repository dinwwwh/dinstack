import { z } from 'zod'

// TODO: move to shared @api and @web
export const authOutputSchema = z.object({
  session: z.object({
    id: z.string(),
  }),
})
