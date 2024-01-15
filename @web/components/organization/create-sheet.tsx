import { MutationStatusIcon } from '../mutation-status-icon'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@ui/components/ui/sheet'
import { type ApiOutputs, api } from '@web/lib/api'
import { useId, useRef } from 'react'

type Props = React.ComponentPropsWithoutRef<typeof Sheet> & {
  onSuccess?: (result: ApiOutputs['organization']['create']) => void
}

export function OrganizationCreateSheet({ children, onSuccess, ...props }: Props) {
  const nameId = useId()
  const closeElement = useRef<HTMLButtonElement>(null)

  const { mutate, isLoading, status } = api.organization.create.useMutation({
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
            Create a new organization to collaborate with others. You can invite others to your
            organization later.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 mt-6" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label htmlFor={nameId} className="text-right">
              Name
            </Label>
            <Input
              id={nameId}
              className="col-span-3"
              placeholder="Your organization"
              name="name"
              required
              minLength={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <SheetClose asChild>
              <Button ref={closeElement} type="button" variant="secondary" className="flex-1">
                Close
              </Button>
            </SheetClose>
            <Button disabled={isLoading} className="gap-2 flex-1">
              Submit
              <MutationStatusIcon status={status} />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
