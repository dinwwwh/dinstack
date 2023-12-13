export function isActivePathname(pathname: string, currentPathname: string) {
  return `${currentPathname}/`.startsWith(`${pathname}/`)
}
