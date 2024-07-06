import { IconoirProvider } from 'iconoir-react'
import { FC, ReactNode } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { theme } from '../../theme'
import { cn } from '../../utils/className'

interface IProps {
  placeholder?: string
  IconLeft?: ReactNode
  IconRight?: ReactNode
  className?: ClassNameValue
}

export const Input: FC<IProps> = ({ placeholder, IconLeft, IconRight, className }) => {
  return (
    <div
      className={cn(
        'tw-flex tw-bg-neutrals-white tw-border tw-border-neutrals-200 tw-rounded-lg tw-h-10 tw-items-center tw-px-3 focus-within:tw-border-2 focus-within:tw-border-brand-500',
        className,
      )}
    >
      <IconoirProvider
        iconProps={{
          color: theme.colors['neutrals-400'],
          strokeWidth: 2,
          width: '1.125em',
          height: '1.125em',
        }}
      >
        {IconLeft && IconLeft}
        <input
          className={cn('tw-flex-1 tw-outline-none', IconLeft && 'tw-ml-2 ')}
          placeholder={placeholder}
        />
        {IconRight && IconRight}
      </IconoirProvider>
    </div>
  )
}
