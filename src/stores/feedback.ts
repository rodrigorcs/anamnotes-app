import { create } from 'zustand'
import { IFeedback } from '../hooks/useFeedback'

interface IFeedbackStore {
  feedback: IFeedback | null
  setFeedback: (feedback: IFeedback | null) => void
  clearFeedback: () => void
}

const INITIAL_STATE: Pick<IFeedbackStore, 'feedback'> = {
  feedback: null,
} as const

export const useFeedbackStore = create<IFeedbackStore>((set) => ({
  ...INITIAL_STATE,

  setFeedback: (feedback: IFeedback | null) => set(() => ({ feedback })),

  clearFeedback: () => {
    set(() => ({ feedback: null }))
  },
}))
