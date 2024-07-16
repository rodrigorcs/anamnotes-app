import { useState } from 'react'

export interface IFeedback {
  type: 'success' | 'info' | 'warning' | 'error'
  title?: string
  message: string
}

interface IUseFeedback {
  feedback: IFeedback | null
  setFeedback: (feedback: IFeedback) => void
  clearFeedback: () => void
  setUnexpectedError: () => void
}

export const useFeedback = (): IUseFeedback => {
  const [feedback, setFeedback] = useState<IFeedback | null>(null)
  const clearFeedback = () => setFeedback(null)
  const setUnexpectedError = () =>
    setFeedback({ type: 'error', message: 'Ocorreu um erro, tente novamente mais tarde.' })

  return {
    feedback,
    setFeedback,
    clearFeedback,
    setUnexpectedError,
  }
}
