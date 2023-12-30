import { api } from '@web/lib/api'
import imageCompression from 'browser-image-compression'
import { Base64 } from 'js-base64'
import { useRef } from 'react'

type Props = {
  organizationId: string
  children: (opts: {
    mutation: ReturnType<typeof api.organization.changeLogo.useMutation>
    fn: () => void
  }) => React.ReactNode
}

export function OrganizationUpdateLogoFn(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mutation = api.organization.changeLogo.useMutation()

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
      organization: {
        id: props.organizationId,
        avatar: {
          name: compressedImage.name,
          base64: avatarBase64,
        },
      },
    })
  }

  return (
    <>
      {props.children({ mutation, fn: () => inputRef.current?.click() })}
      <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={onChange} />
    </>
  )
}
