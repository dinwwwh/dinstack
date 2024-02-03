import { NotificationFeedPopover, NotificationIconButton } from '@knocklabs/react'
import * as Portal from '@radix-ui/react-portal'
import { useState, useRef } from 'react'

export function NotificationButton() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <NotificationIconButton ref={buttonRef} onClick={() => setIsVisible(!isVisible)} />
      <Portal.Root>
        <NotificationFeedPopover
          buttonRef={buttonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </Portal.Root>
    </>
  )
}
