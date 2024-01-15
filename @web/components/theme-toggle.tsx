'use client'

import { Button } from '@ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { useSystemStore } from '@web/stores/system'
import { MoonIcon, SunIcon } from 'lucide-react'

export function ThemeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary" size="sm" className="h-9 w-9 p-0">
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
