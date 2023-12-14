export function isActivePathname(pathname: string, currentPathname: string) {
  return `${currentPathname}/`.startsWith(`${pathname}/`)
}

export function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
