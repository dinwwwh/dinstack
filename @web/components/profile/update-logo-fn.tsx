import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import imageCompression from 'browser-image-compression'
import { Base64 } from 'js-base64'
import { useRef } from 'react'

type Props = {
  children: (opts: {
    mutation: ReturnType<typeof api.auth.profile.updateAvatarUrl.useMutation>
    fn: () => void
  }) => React.ReactNode
}

export function ProfileUpdateLogoFn(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mutation = api.auth.profile.updateAvatarUrl.useMutation({
    onSuccess(data) {
      const authState = useAuthStore.getState().state
      if (!authState) return

      useAuthStore.setState({
        state: {
          ...authState,
          user: {
            ...authState.user,
            avatarUrl: data.avatarUrl,
          },
        },
      })
    },
  })

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
      {props.children({ mutation, fn: () => inputRef.current?.click() })}
      <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={onChange} />
    </>
  )
}
