/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ComponentPropsWithoutRef } from 'react'
import { type InjectedViewportProps, handleViewport } from 'react-in-viewport'

const Block = ({
  inViewport,
  forwardedRef,
  enterCount,
  leaveCount,
  ...props
}: InjectedViewportProps<HTMLDivElement>) => {
  return <div ref={forwardedRef} {...props} />
}

const Viewport = handleViewport(Block)

type Props = ComponentPropsWithoutRef<'div'> & {
  onEnterViewport?: () => void
  onLeaveViewport?: () => void
  children?: React.ReactNode
}

export const ViewportBlock = (props: Props) => {
  return <Viewport {...props} />
}
