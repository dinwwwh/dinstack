import { env } from '@web/env'

export function isActivePathname(pathname: string, currentPathname: string) {
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
