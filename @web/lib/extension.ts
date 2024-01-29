import { z } from 'zod'

export const extensionAuthStateSchema = z.object({
  token: z.string().nullable(),
})

export type ExtensionAuthState = z.infer<typeof extensionAuthStateSchema>
