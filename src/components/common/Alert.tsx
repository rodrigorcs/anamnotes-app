import { ElementType, FC, ReactNode } from 'react'
import {
  InfoCircle as InfoIcon,
  CheckCircle as SuccessIcon,
  WarningTriangle as WarningIcon,
  WarningCircle as ErrorIcon,
  IconoirProvider,
} from 'iconoir-react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../utils/className'
import { IFeedback } from '../../hooks/useFeedback'

interface IProps {
  feedback: IFeedback | null
  className?: ClassNameValue
}

interface IFeedbackContent {
  containerStyle: ClassNameValue
  textStyle: ClassNameValue
  iconStyle: ClassNameValue
  Icon: ElementType
}

const getContentFromFeedback = (feedback: IFeedback): IFeedbackContent => {
  const feedbackContentMapping: Record<IFeedback['type'], IFeedbackContent> = {
    info: {
      containerStyle: 'tw-bg-feedback-info-100',
      textStyle: 'tw-text-feedback-info-500',
      iconStyle: 'tw-text-feedback-info-300',
      Icon: InfoIcon,
    },
    success: {
      containerStyle: 'tw-bg-feedback-positive-100',
      textStyle: 'tw-text-feedback-positive-500',
      iconStyle: 'tw-text-feedback-positive-300',
      Icon: SuccessIcon,
    },
    warning: {
      containerStyle: 'tw-bg-feedback-warning-100',
      textStyle: 'tw-text-feedback-warning-500',
      iconStyle: 'tw-text-feedback-warning-300',
      Icon: WarningIcon,
    },
    error: {
      containerStyle: 'tw-bg-feedback-negative-100',
      textStyle: 'tw-text-feedback-negative-500',
      iconStyle: 'tw-text-feedback-negative-300',
      Icon: ErrorIcon,
    },
  }

  return feedbackContentMapping[feedback.type]
}

export const Alert: FC<IProps> = ({ feedback, className }) => {
  if (!feedback) return null

  const content = getContentFromFeedback(feedback)

  return (
    <div className={cn('tw-flex tw-p-4 tw-rounded', content.containerStyle, className)}>
      <div className="tw-flex tw-h-6 tw-w-5 tw-items-center tw-justify-center">
        <IconoirProvider
          iconProps={{
            width: 20,
            height: 20,
            strokeWidth: 2.25,
          }}
        >
          <content.Icon className={cn(content.iconStyle)} />
        </IconoirProvider>
      </div>
      <div className="tw-flex tw-flex-col tw-flex-1 tw-ml-3">
        <h3 className={cn('tw-font-medium tw-leading-6', content.textStyle)}>{feedback.title}</h3>
        <p
          className={cn(
            'tw-text-sm tw-font-light',
            feedback.title ? 'tw-mt-2' : 'tw-leading-6',
            content.textStyle,
          )}
        >
          {feedback.message}
        </p>
      </div>
    </div>
  )
}
