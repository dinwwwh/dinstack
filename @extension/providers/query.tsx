import { useAuthStore } from '@extension/stores/auth'
import { BaseQueryProvider } from '@web/providers/query'

function getAuthToken() {
  return useAuthStore.getState().state?.token
}

function signOut() {
  return useAuthStore.setState({ state: null })
}

export function QueryProvider(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof BaseQueryProvider>,
    'getAuthToken' | 'signOut' | 'auth'
  >,
) {
  const auth = useAuthStore().state

  return <BaseQueryProvider {...props} getAuthToken={getAuthToken} signOut={signOut} auth={auth} />
}
