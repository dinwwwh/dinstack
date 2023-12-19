import type { Env } from '@api/env'
import { GitHub, Google } from 'arctic'

export function createAuthGoogle({ env }: { env: Env }) {
  return new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URL, {
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
  })
}

export function createAuthGithub({ env }: { env: Env }) {
  return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {
    scope: ['user:email'],
  })
}
