'use client'

import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Turnstile as Base } from '@marsidev/react-turnstile'
import { useId, useRef, useState } from 'react'

export function Turnstile() {
  const [token, setToken] = useState('')
  const ref = useRef<TurnstileInstance>()
  const id = useId()
  return (
    <div>
      <Base
        ref={ref}
        id={id}
        // siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        siteKey="2x00000000000000000000AB"
        onSuccess={(token) => setToken(token)}
        onError={() => console.error('error')}
        onExpire={() => ref.current?.reset()}
      />
      <input type="text" name="cf-turnstile-token" value={token} readOnly required />
    </div>
  )
}
