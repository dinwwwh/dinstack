import { env } from '@web-content/lib/env'

export function constructPublicResourceUrl(url: string): string {
  return new URL(url, env.NEXT_PUBLIC_PUBLIC_BUCKET_URL).toString()
}

export function isActivePathname(url: string, currentPathname: string) {
  const { pathname } = new URL(url, 'https://dinsterizer.com')
  return `${currentPathname}/`.startsWith(`${pathname}/`)
}
