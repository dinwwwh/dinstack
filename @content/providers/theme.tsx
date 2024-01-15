'use client'

import { ThemeProvider as Base } from 'next-themes'

export function ThemeProvider(props: { children: React.ReactNode }) {
  return <Base attribute="class">{props.children}</Base>
}
