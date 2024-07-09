import { FC } from 'react'
import { cn } from '../../utils/className'
import { SkeletonRectangle, randomInInterval } from './SkeletonRectangle'

export const SummarizationSkeleton: FC = () => {
  return (
    <>
      <SkeletonRectangle width={20} height={2.25} />
      <div className="tw-mt-8">
        {Array(3)
          .fill('skeleton-section-title')
          .map((_, index) => (
            <div className={cn(index > 0 && 'tw-mt-8')}>
              <SkeletonRectangle key={index} width={randomInInterval(12, 24)} height={1.5} />
              {Array(randomInInterval(2, 5))
                .fill('skeleton-section-content')
                .map((_, index) => (
                  <SkeletonRectangle
                    key={index}
                    width={randomInInterval(32, 38)}
                    height={1}
                    className={cn(index > 0 ? 'tw-mt-1' : 'tw-mt-5')}
                  />
                ))}
            </div>
          ))}
      </div>
      <div className="tw-flex tw-mt-12 tw-items-center">
        <SkeletonRectangle width={12} height={2} rounded />
        <SkeletonRectangle width={8} height={2} rounded className="tw-ml-4" />
      </div>
    </>
  )
}
