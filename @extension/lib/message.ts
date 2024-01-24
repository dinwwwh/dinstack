type MessageDir = {
  'theme-icon': {
    schema: 'light' | 'dark'
  }
}

export function sendMessage<T extends keyof MessageDir>(type: T, data: MessageDir[T]) {
  chrome.runtime.sendMessage({
    type,
    data,
  })
}

export function onMessage<T extends keyof MessageDir>(type: T, fn: (data: MessageDir[T]) => void) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listener = (message: any) => {
    if (message.type === type) {
      fn(message.data as MessageDir[T])
    }
  }

  chrome.runtime.onMessage.addListener(listener)

  return () => {
    chrome.runtime.onMessage.removeListener(listener)
  }
}
