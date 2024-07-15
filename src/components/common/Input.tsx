import { IconoirProvider } from 'iconoir-react'
import { ChangeEvent, FC, InputHTMLAttributes, ReactNode } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { theme } from '../../theme'
import { cn } from '../../utils/className'
import { RegisterOptions, useFormContext } from 'react-hook-form'
import { convertCamelCaseToKebabCase } from '../../utils/case'

interface IProps
  extends Pick<InputHTMLAttributes<HTMLInputElement>, 'type' | 'required' | 'autoComplete'> {
  id?: string
  formOptions?: RegisterOptions
  title?: string
  hint?: string
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  IconLeft?: ReactNode
  IconRight?: ReactNode
  className?: ClassNameValue
}

export const Input: FC<IProps> = ({
  id,
  formOptions,
  title,
  hint,
  value,
  onChange,
  placeholder,
  IconLeft,
  IconRight,
  className,
  type,
  required,
  autoComplete,
}) => {
  const formMethods = useFormContext()
  const register = formMethods?.register
  const formState = formMethods?.formState
  const errorMessage = id && formState?.errors?.[id]?.message?.toString()

  return (
    <div className={cn(className)}>
      {title && (
        <label className="tw-text-neutrals-700 tw-text-sm" htmlFor={id}>
          {title}
        </label>
      )}
      <div
        className={cn(
          'tw-flex tw-bg-neutrals-white tw-border tw-border-neutrals-200 tw-rounded tw-h-10 tw-items-center tw-px-3 focus-within:tw-border-2 focus-within:tw-border-brand-500',
          title && 'tw-mt-1',
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
            {...(register && id && { ...register(id, formOptions) })}
            {...(value && { value })}
            {...(onChange && { onChange })}
            {...(id && { id: convertCamelCaseToKebabCase(id) })}
            className={cn('tw-flex-1 tw-outline-none tw-text-sm', IconLeft && 'tw-ml-2 ')}
            placeholder={placeholder}
            type={type}
            required={required}
            autoComplete={autoComplete}
          />
          {IconRight && IconRight}
        </IconoirProvider>
      </div>
      {!errorMessage && hint && <p className="tw-text-neutrals-500 tw-text-xs tw-mt-1">{hint}</p>}
      {errorMessage && (
        <p className="tw-text-feedback-negative-300 tw-text-xs tw-mt-1">{errorMessage}</p>
      )}
    </div>
  )
}
