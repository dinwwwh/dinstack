export function isActivePathname(url: string, currentPathname: string) {
  const { pathname } = new URL(url, 'https://dinsterizer.com')
  return `${currentPathname}/`.startsWith(`${pathname}/`)
}
