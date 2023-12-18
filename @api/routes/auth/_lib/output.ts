import { authClientSchema } from '@shared/schemas/auth'
import { z } from 'zod'

export const authOutputSchema = z.object({
  auth: authClientSchema,
})
