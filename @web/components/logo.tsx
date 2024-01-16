import { Skeleton } from './ui/skeleton'
import { match } from 'ts-pattern'

type Props = {
  variant?: 'default' | 'icon'
  size?: number
}

export function Logo({ size = 30, variant = 'default' }: Props) {
  return match(variant)
    .with('default', () => (
      <div className="flex gap-3 items-center">
        <Skeleton style={{ height: `${size}px`, width: `${size}px` }} className="flex-shrink-0" />
        <Skeleton style={{ height: `${size * 0.7}px`, width: `${size * 4}px` }} />
      </div>
    ))
    .with('icon', () => <Skeleton style={{ height: `${size}px`, width: `${size}px` }} />)
    .exhaustive()
}
