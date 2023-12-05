'use client'

import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    throw new Error('This page should never be rendered')
  }, [])
  return <div>dash</div>
}
