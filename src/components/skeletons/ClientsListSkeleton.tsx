import { FC } from 'react'
import { cn } from '../../utils/className'
import { SkeletonRectangle, randomInInterval } from './SkeletonRectangle'

export const ClientsListSkeleton: FC = () => {
  return (
    <>
      <div className="tw-mt-8 tw-px-6">
        {Array(3)
          .fill('skeleton-section-group')
          .map((listSlug, index) => (
            <div key={`${listSlug}-${index}`}>
              <SkeletonRectangle
                width={randomInInterval(4, 8)}
                height={0.825}
                className={cn(index > 0 && 'tw-mt-5')}
              />
              <div className="tw-mt-5">
                {Array(randomInInterval(3, 5))
                  .fill('skeleton-section-client')
                  .map((listSlug, index) => (
                    <div
                      key={`${listSlug}-${index}`}
                      className={cn('tw-flex tw-items-center', index > 0 && 'tw-mt-3')}
                    >
                      <SkeletonRectangle width={1.75} height={1.75} rounded />
                      <SkeletonRectangle
                        width={randomInInterval(6, 11)}
                        height={1.125}
                        className={cn('tw-ml-2')}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </>
  )
}
