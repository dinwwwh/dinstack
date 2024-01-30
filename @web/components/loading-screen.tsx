import { Loader2Icon } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="fixed z-[9999] inset-0 bg-background flex items-center justify-center">
      <Loader2Icon className="size-6 text-muted-foreground animate-spin" />
    </div>
  )
}
