import { FC } from 'react'
import { cn } from '../../utils/className'
import { SkeletonRectangle, randomInInterval } from './SkeletonRectangle'

export const ClientsListSkeleton: FC = () => {
  return (
    <>
      <div className="tw-mt-8 tw-px-6">
        {Array(3)
          .fill('skeleton-section-group')
          .map((_, index) => (
            <>
              <SkeletonRectangle
                key={index}
                width={4}
                height={0.75}
                className={cn(index > 0 && 'tw-mt-5')}
              />
              <div className="tw-mt-5">
                {Array(randomInInterval(3, 5))
                  .fill('skeleton-section-client')
                  .map((_, index) => (
                    <div className={cn('tw-flex tw-items-center', index > 0 && 'tw-mt-3')}>
                      <SkeletonRectangle key={index} width={1.75} height={1.75} rounded />
                      <SkeletonRectangle
                        key={index}
                        width={randomInInterval(6, 11)}
                        height={1.125}
                        className={cn('tw-ml-2')}
                      />
                    </div>
                  ))}
              </div>
            </>
          ))}
      </div>
    </>
  )
}
