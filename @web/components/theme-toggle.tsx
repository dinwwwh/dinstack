'use client'

import { Button } from '@web/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@web/components/ui/dropdown-menu'
import { useSystemStore } from '@web/stores/system'
import { MoonIcon, SunIcon } from 'lucide-react'

type Props = {
  variant?: 'secondary' | 'ghost'
}

export function ThemeToggle({ variant = 'secondary' }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant={variant} size="sm" className="h-8 w-8 p-0 relative">
          <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => useSystemStore.setState({ theme: 'light' })}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => useSystemStore.setState({ theme: 'dark' })}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => useSystemStore.setState({ theme: 'system' })}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
