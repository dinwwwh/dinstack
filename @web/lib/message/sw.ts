import { MessageDir } from './types'
import { match } from 'ts-pattern'

declare let self: ServiceWorkerGlobalScope

export function postMessageToWindow<T extends keyof MessageDir>(
  type: T,
  data: MessageDir[T],
  option: { to?: 'last' | 'all' } = {},
) {
  const { to = 'last' } = option
  const payload = {
    type,
    data,
  }

  self.clients.matchAll().then(function (clients) {
    if (clients && clients.length) {
      match(to)
        .with('last', () => clients[0]?.postMessage(payload))
        .with('all', () => clients.forEach((c) => c.postMessage(payload)))
        .exhaustive()
    }
  })
}

export function onWindowMessage<T extends keyof MessageDir>(
  type: T,
  fn: (data: MessageDir[T]) => void,
) {
  const listener = (e: ExtendableMessageEvent) => {
    if (e.data.type === type) {
      fn(e.data.data as MessageDir[T])
    }
  }

  self.addEventListener('message', listener)

  return () => {
    self.removeEventListener('message', listener)
  }
}
