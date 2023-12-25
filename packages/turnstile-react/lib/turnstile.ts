import { useTurnstileStore } from '@turnstile-react/stores/turnstile'

export async function getTurnstileToken(): Promise<string> {
  const store = useTurnstileStore.getState()
  if (store.token) {
    return store.token
  }

  useTurnstileStore.setState({ isShowChallenge: true })
  const token = await new Promise<string>((resolve) => {
    const unsubscribe = useTurnstileStore.subscribe(
      (state) => ({ token: state.token }),
      (state) => {
        if (state.token) {
          unsubscribe()
          resolve(state.token)
        }
      },
    )
  })
  useTurnstileStore.setState({ isShowChallenge: false })
  useTurnstileStore.getState().instance?.reset()

  return token
}
