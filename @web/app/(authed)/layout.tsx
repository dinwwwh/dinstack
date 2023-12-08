import { Button } from '@dinstack/ui/button'
import { CaretLeftIcon } from '@radix-ui/react-icons'
import { Navbar } from './_components/navbar'
import { RequireAuthedWrapper } from './_wrappers/require-authed'

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuthedWrapper>
      <div className="h-full flex">
        <div className="h-full max-w-[280px] p-4 pb-6 relative z-10">
          <Navbar />

          <div className="absolute top-2 -right-3">
            <Button type="button" variant={'outline'} size={'icon'} className="h-6 w-6 bg-background">
              <CaretLeftIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 h-full">{children}</div>
      </div>
    </RequireAuthedWrapper>
  )
}
