import { onMessage } from '@extension/lib/message'
import { match } from 'ts-pattern'

onMessage('theme-icon', (data) => {
  match(data)
    .with({ schema: 'dark' }, () => {
      chrome.action.setIcon({
        path: {
          '16': 'icon-16-dark.png',
          '32': 'icon-32-dark.png',
          '48': 'icon-48-dark.png',
          '128': 'icon-128-dark.png',
        },
      })
    })
    .with({ schema: 'light' }, () => {
      chrome.action.setIcon({
        path: {
          '16': 'icon-16.png',
          '32': 'icon-32.png',
          '48': 'icon-48.png',
          '128': 'icon-128.png',
        },
      })
    })
    .exhaustive()
})
