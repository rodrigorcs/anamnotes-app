import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../utils/className'

interface IProps {
  fullName: string
  className?: ClassNameValue
}

export const Avatar: FC<IProps> = ({ fullName, className }) => {
  const initials = fullName
    .split(' ')
    .map((name: string) => name[0])
    .join('')

  return (
    <div
      className={cn(
        'tw-flex tw-size-7 tw-rounded-full tw-bg-[#E6F3FF] tw-items-center tw-justify-center tw-text-center',
        className,
      )}
    >
      <span className="tw-text-xs tw-font-medium tw-text-brand-500">{initials}</span>
    </div>
  )
}
