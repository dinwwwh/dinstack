import { type authStateSchema, useAuthStore } from '@web/stores/auth'
import SuperJSON from 'superjson'
import type { z } from 'zod'

chrome.runtime.onMessageExternal.addListener((message) => {
  if (message.type === 'login') {
    const data = SuperJSON.parse(message.data) as { auth: z.infer<typeof authStateSchema> }

    useAuthStore.setState({ state: data.auth })
  }
})
