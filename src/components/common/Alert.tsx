import { FC } from 'react'
import { WarningCircle as ErrorIcon, IconoirProvider } from 'iconoir-react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../utils/className'
import { IFeedback } from '../../hooks/useFeedback'

interface IProps {
  feedback: IFeedback | null
  className?: ClassNameValue
}

export const Alert: FC<IProps> = ({ feedback, className }) => {
  if (!feedback) return null

  return (
    <div className={cn('tw-flex tw-p-4 tw-bg-feedback-negative-100 tw-rounded', className)}>
      <div className="tw-flex tw-h-6 tw-w-5 tw-items-center tw-justify-center">
        <IconoirProvider
          iconProps={{
            width: 20,
            height: 20,
            strokeWidth: 2.25,
          }}
        >
          <ErrorIcon className="tw-text-feedback-negative-300" />
        </IconoirProvider>
      </div>
      <div className="tw-flex tw-flex-col tw-flex-1 tw-ml-3">
        <h3 className="tw-font-medium tw-text-feedback-negative-500 tw-leading-6">
          {feedback.title}
        </h3>
        <p
          className={cn(
            'tw-text-sm tw-font-light tw-text-feedback-negative-500',
            feedback.title ? 'tw-mt-2' : 'tw-leading-6',
          )}
        >
          {feedback.message}
        </p>
      </div>
    </div>
  )
}
