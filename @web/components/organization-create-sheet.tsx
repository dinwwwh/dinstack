import { Button } from '@dinstack/ui/button'
import { Input } from '@dinstack/ui/input'
import { Label } from '@dinstack/ui/label'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@dinstack/ui/sheet'
import { ReloadIcon } from '@radix-ui/react-icons'
import { ApiOutputs, api } from '@web/lib/api'
import { useId, useRef } from 'react'

type Props = React.ComponentPropsWithoutRef<typeof Sheet> & {
  onSuccess?: (result: ApiOutputs['organization']['create']) => void
}

export function OrganizationCreateSheet({ children, onSuccess, ...props }: Props) {
  const nameId = useId()
  const closeElement = useRef<HTMLButtonElement>(null)

  const { mutate, isLoading } = api.organization.create.useMutation({
    onSuccess(data) {
      onSuccess?.(data)
      closeElement.current?.click()
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value

    mutate({
      organization: {
        name,
      },
    })
  }

  return (
    <Sheet {...props}>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create organization</SheetTitle>
          <SheetDescription>
            Create a new organization to collaborate with others. You can invite others to your organization later.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 mt-6" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label htmlFor={nameId} className="text-right">
              Name
            </Label>
            <Input id={nameId} className="col-span-3" placeholder="Your workspace" name="name" required minLength={3} />
          </div>

          <div className="flex justify-end gap-4">
            <SheetClose asChild>
              <Button ref={closeElement} type="button" variant="secondary">
                Close
              </Button>
            </SheetClose>
            <Button disabled={isLoading}>
              Submit {isLoading && <ReloadIcon className="w-4 h-4 animate-spin ml-2" />}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
