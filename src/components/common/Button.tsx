import { IconoirProvider } from 'iconoir-react'
import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import { theme } from '../../theme'
import { cn } from '../../utils/className'
import { ClassNameValue } from 'tailwind-merge'

type TButtonVariant = 'primary' | 'secondary' | 'tertiary'
type TButtonSize = 'small' | 'medium'

interface IStyles {
  buttonClassNames: ClassNameValue
  textClassNames: ClassNameValue
  iconProps: Partial<React.SVGProps<SVGSVGElement>>
}

const getStylesByVariant = (variant: TButtonVariant): IStyles => {
  const stylesByVariant: Record<TButtonVariant, IStyles> = Object.freeze({
    primary: {
      buttonClassNames:
        'tw-px-6 tw-bg-brand-500 hover:tw-bg-brand-700 disabled:tw-bg-brand-300 tw-shadow-[0_4px_8px_0px_rgba(0,0,0,0.15)]',
      textClassNames: 'tw-text-neutrals-white',
      iconProps: {
        color: theme.colors['neutrals-white'],
      },
    },
    secondary: {
      buttonClassNames: 'tw-px-6 tw-bg-background-200',
      textClassNames: 'tw-text-brand-500 group-hover:tw-text-brand-700',
      iconProps: {
        color: theme.colors['brand-500'],
        width: '1.25em',
        height: '1.25em',
        className: 'group-hover:tw-text-brand-700',
      },
    },
    tertiary: {
      buttonClassNames: 'tw-px-4',
      textClassNames: 'tw-text-brand-500 group-hover:tw-text-brand-700',
      iconProps: {
        color: theme.colors['brand-500'],
        className: 'group-hover:tw-text-brand-700',
      },
    },
  } as const)

  return stylesByVariant[variant]
}

interface IProps {
  text?: string
  IconLeft?: ReactNode
  IconRight?: ReactNode
  size?: TButtonSize
  variant?: TButtonVariant
  rounded?: boolean
  className?: ClassNameValue
  textClassName?: ClassNameValue
  iconClassName?: ClassNameValue
  isDisabled?: boolean
  onClick?: () => void
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export const Button: FC<IProps> = ({
  text,
  IconLeft,
  IconRight,
  variant = 'primary',
  size = 'medium',
  rounded,
  className,
  textClassName,
  iconClassName,
  isDisabled,
  onClick,
  type,
}) => {
  const variantStyles = getStylesByVariant(variant)

  return (
    <button
      className={cn(
        'tw-flex tw-group tw-items-center tw-justify-center tw-transition-colors',
        variantStyles.buttonClassNames,
        rounded ? 'tw-rounded-full' : 'tw-rounded-lg',
        size === 'small' ? 'tw-h-10' : 'tw-h-11',
        className,
      )}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
    >
      <IconoirProvider
        iconProps={{
          strokeWidth: 2,
          width: '1.5em',
          height: '1.5em',
          ...variantStyles.iconProps,
          className: cn('tw-transition-colors', variantStyles.iconProps.className, iconClassName),
        }}
      >
        {IconLeft && IconLeft}
        {text && (
          <p
            className={cn(
              'tw-text-sm',
              IconLeft && 'tw-ml-2',
              IconRight && 'tw-mr-2',
              variantStyles.textClassNames,
              textClassName,
            )}
          >
            {text}
          </p>
        )}
        {IconRight && IconRight}
      </IconoirProvider>
    </button>
  )
}
