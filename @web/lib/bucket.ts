import { env } from './env'

export function constructPublicResourceUrl(url: string): string {
  return new URL(url, env.PUBLIC_BUCKET_BASE_URL).toString()
}
