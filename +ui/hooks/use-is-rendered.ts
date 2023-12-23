import { useEffect, useState } from 'react'

export function useIsRendered() {
  const [isRendered, setIsRendered] = useState(false)
  useEffect(() => {
    setIsRendered(true)
  }, [])
  return isRendered
}
