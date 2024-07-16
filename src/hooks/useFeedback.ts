import { useState } from 'react'
import { useFeedbackStore } from '../stores/feedback'

export enum EFeedbackTopics {
  CONVERSATIONS = 'conversations',
  CONVERSATION = 'conversation',
  RECORDING = 'recording',
}

export interface IFeedback {
  id?: string
  topic?: EFeedbackTopics
  type: 'success' | 'info' | 'warning' | 'error'
  title?: string
  message: string
}

interface ISetFeedbackOptions {
  postToTopic: EFeedbackTopics
}

interface IClearFeedbackOptions {
  global?: boolean
  id?: string
}

interface IProps {
  subscribeToTopic: EFeedbackTopics
}

interface IUseFeedback {
  feedback: IFeedback | null
  setFeedback: (feedback: IFeedback, options?: ISetFeedbackOptions) => void
  clearFeedback: (options?: IClearFeedbackOptions) => void
  setUnexpectedError: (options?: ISetFeedbackOptions) => void
}

export const useFeedback = (props?: IProps): IUseFeedback => {
  const [localFeedback, setLocalFeedback] = useState<IFeedback | null>(null)

  const globalFeedback = useFeedbackStore((state) => state.feedback)
  const setGlobalFeedback = useFeedbackStore((state) => state.setFeedback)

  const feedback =
    props?.subscribeToTopic === globalFeedback?.topic ? globalFeedback : localFeedback

  const setFeedback = (feedback: IFeedback, options?: ISetFeedbackOptions) => {
    if (options?.postToTopic) {
      setGlobalFeedback({ ...feedback, topic: options.postToTopic })
      return
    }
    setLocalFeedback(feedback)
  }

  const clearFeedback = (options?: IClearFeedbackOptions) => {
    if (options?.global) {
      setGlobalFeedback(null)
      return
    }

    if (options?.id) {
      if (globalFeedback?.id === options.id) {
        setGlobalFeedback(null)
        return
      }
      if (localFeedback?.id === options.id) {
        setLocalFeedback(null)
        return
      }
    }
    setLocalFeedback(null)
  }

  const setUnexpectedError = (options?: ISetFeedbackOptions) => {
    const unexpectedErrorFeedback: IFeedback = {
      type: 'error',
      message: 'Ocorreu um erro, tente novamente mais tarde.',
    }

    if (options?.postToTopic) {
      setGlobalFeedback({ ...unexpectedErrorFeedback, topic: options.postToTopic })
      return
    }
    setLocalFeedback(unexpectedErrorFeedback)
  }

  return {
    feedback,
    setFeedback,
    clearFeedback,
    setUnexpectedError,
  }
}
