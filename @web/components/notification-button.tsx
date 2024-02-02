import { Button } from './ui/button'
import { NotificationFeedPopover } from '@knocklabs/react'
import * as Portal from '@radix-ui/react-portal'
import { cn } from '@web/lib/utils'
import { BellIcon } from 'lucide-react'
import { useState, useRef } from 'react'

type Props = {
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>
  iconProps?: {
    className?: string
  }
}

export function NotificationButton({ buttonProps, iconProps }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        {...buttonProps}
        ref={buttonRef}
        type="button"
        onClick={() => setIsVisible(!isVisible)}
      >
        <span className="sr-only">Notifications</span>
        <BellIcon className={cn('size-5', iconProps?.className)} />
      </Button>
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
