import { sendMessage } from '@extension/lib/message'

const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
sendMessage('theme-icon', { schema: mediaQueryList.matches ? 'dark' : 'light' })

const callback = (event: MediaQueryListEvent) => {
  sendMessage('theme-icon', { schema: event.matches ? 'dark' : 'light' })
}

mediaQueryList.addEventListener('change', callback)
