import { Skeleton } from './skeleton'
import { cn } from '@ui/lib/utils'

type Props = {
  count: number
}

export function GeneralSkeleton({ count }: Props) {
  const heights = ['h-16', 'h-8', 'h-6', 'h-32']
  return (
    <div className="space-y-2 flex flex-col">
      {Array(count)
        .fill('')
        .map((_, index) => (
          <Skeleton key={index} className={cn('w-full', heights[index % heights.length])} />
        ))}
    </div>
  )
}
