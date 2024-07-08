import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../utils/className'

export const randomInInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

interface IProps {
  width: number
  height: number
  rounded?: boolean
  className?: ClassNameValue
}

export const SkeletonRectangle: FC<IProps> = ({ width, height, rounded, className }) => {
  return (
    <div
      className={cn(
        'tw-bg-background-200 tw-animate-pulse',
        rounded ? 'tw-rounded-full' : 'tw-rounded',
        className,
      )}
      style={{
        width: `${width}rem`,
        height: `${height}rem`,
      }}
    />
  )
}
