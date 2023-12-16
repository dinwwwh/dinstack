import { env } from '@web/env'

export function isActivePathname(url: string, currentPathname: string) {
  const { pathname } = new URL(url, 'https://dinsterizer.com')
  return `${currentPathname}/`.startsWith(`${pathname}/`)
}

export function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function constructPublicResourceUrl(url: string): string {
  return new URL(url, env.NEXT_PUBLIC_PUBLIC_BUCKET_URL).toString()
}

export function convertFileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}
