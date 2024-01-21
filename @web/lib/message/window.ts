import { MessageDir } from './types'

export function postMessageToSW<T extends keyof MessageDir>(type: T, data: MessageDir[T]) {
  navigator.serviceWorker.controller?.postMessage({
    type,
    data,
  })
}

export function onSWMessage<T extends keyof MessageDir>(
  type: T,
  fn: (data: MessageDir[T]) => void,
) {
  const listener = (e: MessageEvent) => {
    if (e.data.type === type) {
      fn(e.data.data as MessageDir[T])
    }
  }

  navigator.serviceWorker.addEventListener('message', listener)

  return () => {
    navigator.serviceWorker.removeEventListener('message', listener)
  }
}
