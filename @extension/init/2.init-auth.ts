import { useAuthStore } from '@extension/stores/auth'
import { extensionAuthStateSchema } from '@web/lib/extension'
import SuperJSON from 'superjson'
import { z } from 'zod'

chrome.runtime.onMessageExternal.addListener((message) => {
  if (message.type === 'auth') {
    const data = z
      .object({
        auth: extensionAuthStateSchema,
      })
      .parse(SuperJSON.parse(message.data))

    useAuthStore.setState({ state: data.auth })
  }
})
