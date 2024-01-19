import { env } from '@web/lib/env'

export function getTwitterHandler() {
  return '@' + env.TWITTER_AUTHOR_PROFILE_URL.split('/')[3]
}
