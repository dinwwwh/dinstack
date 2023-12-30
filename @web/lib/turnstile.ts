import { useTurnstileStore } from '@web/stores/turnstile'

export async function getTurnstileToken(): Promise<string> {
  const token =
    useTurnstileStore.getState().token ||
    (await new Promise<string>((resolve) => {
      useTurnstileStore.setState({ isShowChallenge: true })
      const unsubscribe = useTurnstileStore.subscribe(
        (state) => ({ token: state.token }),
        (state) => {
          if (state.token) {
            unsubscribe()
            resolve(state.token)
          }
        },
      )
    }))

  useTurnstileStore.setState({ isShowChallenge: false, token: null })
  useTurnstileStore.getState().instance?.reset()

  return token
}
