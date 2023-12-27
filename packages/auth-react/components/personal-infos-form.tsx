import { api } from '@shared-react/lib/api'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/ui/avatar'
import { Button } from '@ui/ui/button'
import { GeneralError } from '@ui/ui/general-error'
import { GeneralSkeleton } from '@ui/ui/general-skeleton'
import { Input } from '@ui/ui/input'
import { Label } from '@ui/ui/label'
import { MutationStatusIcon } from '@ui/ui/mutation-status-icon'
import imageCompression from 'browser-image-compression'
import { Base64 } from 'js-base64'
import { useId, useRef } from 'react'
import { match } from 'ts-pattern'
import { z } from 'zod'

export function PersonalInfosForm(props: { constructPublicResourceUrl: (path: string) => string }) {
  const nameId = useId()
  const emailId = useId()
  const query = api.auth.infos.useQuery()
  const mutation = api.auth.profile.update.useMutation()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = z
      .object({
        name: z.string(),
      })
      .parse(Object.fromEntries(new FormData(e.currentTarget)))

    mutation.mutate({ user: data })
  }

  return (
    <div className="@container">
      <div className="@2xl:col-span-2 max-w-xl">
        {match(query)
          .with({ status: 'loading' }, () => <GeneralSkeleton count={5} />)
          .with({ status: 'error' }, () => <GeneralError />)
          .with({ status: 'success' }, (query) => (
            <form onSubmit={onSubmit}>
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      alt={query.data.session.organizationMember.user.name}
                      src={props.constructPublicResourceUrl(
                        query.data.session.organizationMember.user.avatarUrl,
                      )}
                    />
                    <AvatarFallback>
                      {query.data.session.organizationMember.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <AvatarChangeButton />
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor={nameId}>Name</Label>
                  <div className="mt-2">
                    <Input
                      id={nameId}
                      name="name"
                      key={query.data.session.organizationMember.user.id}
                      defaultValue={query.data.session.organizationMember.user.name}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={emailId}>Email</Label>
                  <div className="mt-2">
                    <Input
                      id={emailId}
                      key={query.data.session.organizationMember.user.id}
                      type="email"
                      name="email"
                      disabled
                      defaultValue={query.data.session.organizationMember.user.email}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button disabled={mutation.isLoading} className="gap-2">
                  Save
                  <MutationStatusIcon status={mutation.status} />
                </Button>
              </div>
            </form>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}

function AvatarChangeButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const mutation = api.auth.profile.updateAvatarUrl.useMutation()

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const compressedImage = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 200,
      useWebWorker: true,
    })

    const avatarBase64 = Base64.fromUint8Array(new Uint8Array(await compressedImage.arrayBuffer()))
    mutation.mutate({
      avatar: {
        name: compressedImage.name,
        base64: avatarBase64,
      },
    })
  }

  return (
    <>
      <Button
        type="button"
        className="gap-2"
        disabled={mutation.isLoading}
        onClick={() => {
          inputRef.current?.click()
        }}
      >
        Change avatar
        <MutationStatusIcon status={mutation.status} />
      </Button>
      <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={onChange} />
    </>
  )
}
