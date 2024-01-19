import { useSystemStore } from '@web/stores/system'
import { useEffect, useState } from 'react'

export function ThemeProvider(props: { children: React.ReactNode }) {
  const [systemColorSchema, setSystemColorSchema] = useState<'light' | 'dark'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  )
  const systemStore = useSystemStore()

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    const callback = (event: MediaQueryListEvent) => {
      setSystemColorSchema(event.matches ? 'dark' : 'light')
    }

    mediaQueryList.addEventListener('change', callback)

    return () => {
      mediaQueryList.removeEventListener('change', callback)
    }
  }, [])

  useEffect(() => {
    const theme = systemStore.theme === 'system' ? systemColorSchema : systemStore.theme

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [systemStore.theme, systemColorSchema])

  return props.children
}
