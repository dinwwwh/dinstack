import { env } from './env'
import SuperJSON from 'superjson'
import { z } from 'zod'

export const extensionAuthStateSchema = z
  .object({
    token: z.string(),
  })
  .nullable()

type ExtensionAuthState = z.infer<typeof extensionAuthStateSchema>

export function sendAuthToExtension(opts: { authState: ExtensionAuthState }) {
  try {
    window.chrome.runtime.sendMessage(env.EXTENSION_ID, {
      type: 'auth',
      data: SuperJSON.stringify({ auth: opts.authState }),
    })

    return { success: true }
  } catch {
    return { success: false }
  }
}
