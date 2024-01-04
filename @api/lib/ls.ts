import { LemonSqueezy } from '@lemonsqueezy/lemonsqueezy.js'

export function createLemonSqueezy(opts: { lemonsqueezyApiKey: string }) {
  return new LemonSqueezy(opts.lemonsqueezyApiKey)
}
