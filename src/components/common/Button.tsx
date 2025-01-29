import { IconoirProvider } from 'iconoir-react'
import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from 'react'
import { theme } from '../../theme'
import { cn } from '../../utils/className'
import { ClassNameValue } from 'tailwind-merge'
import { Spinner } from './Spinner'

type TButtonVariant = 'primary' | 'secondary' | 'tertiary'
type TButtonSize = 'fit' | 'small' | 'medium'

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
  isLoading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  iconSize?: number
  iconStrokeWidth?: number
  children?: ReactNode
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
  isLoading,
  onClick,
  type = 'button',
  iconSize = 1.5,
  iconStrokeWidth = 2,
  children,
}) => {
  const variantStyles = getStylesByVariant(variant)

  return (
    <button
      className={cn(
        'tw-flex tw-group tw-items-center tw-justify-center tw-transition-colors',
        variantStyles.buttonClassNames,
        rounded ? 'tw-rounded-full' : 'tw-rounded-lg',
        size !== 'fit' ? ('small' ? 'tw-h-10' : 'tw-h-11') : undefined,
        className,
      )}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      type={type}
    >
      <IconoirProvider
        iconProps={{
          strokeWidth: iconStrokeWidth,
          width: `${iconSize}em`,
          height: `${iconSize}em`,
          ...variantStyles.iconProps,
          className: cn('tw-transition-colors', variantStyles.iconProps.className, iconClassName),
        }}
      >
        {IconLeft && IconLeft}
        {children && children}
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
        {isLoading ? (
          <Spinner
            className="tw-animate-spin tw-ml-2"
            color={theme.colors['neutrals-white']}
            strokeWidth={2}
            width="1.125em"
            height="1.125em"
          />
        ) : (
          IconRight && IconRight
        )}
      </IconoirProvider>
    </button>
  )
}
