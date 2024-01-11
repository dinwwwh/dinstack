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
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === type) {
      fn(message.data as MessageDir[T])
    }
  })
}
