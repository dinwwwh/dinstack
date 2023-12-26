'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Button } from '@ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/ui/dropdown-menu'
import { useSystemStore } from '@web-app/stores/system'

export function ThemeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
