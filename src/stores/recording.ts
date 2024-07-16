import { create } from 'zustand'

export enum ERecordingState {
  IDLE = 'idle',
  RECORDING = 'recording',
  PAUSED = 'paused',
  WAITING_RESPONSE = 'waiting-response',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface IRecordingStore {
  recordingState: ERecordingState
  elapsedTime: number
  clientName: string | null
  setRecordingState: (recordingState: ERecordingState) => void
  setClientName: (clientName: string) => void
  clearRecordingState: () => void
}

const INITIAL_STATE: Pick<IRecordingStore, 'clientName' | 'elapsedTime' | 'recordingState'> = {
  recordingState: ERecordingState.IDLE,
  elapsedTime: 0,
  clientName: null,
} as const

export const useRecordingStore = create<IRecordingStore>((set) => ({
  ...INITIAL_STATE,
  setRecordingState: (recordingState: ERecordingState) => set(() => ({ recordingState })),
  setClientName: (clientName: string) => set(() => ({ clientName })),
  clearRecordingState: () => set(() => INITIAL_STATE),
}))

setInterval(() => {
  const { recordingState, elapsedTime } = useRecordingStore.getState()
  if (recordingState === ERecordingState.RECORDING) {
    useRecordingStore.setState({ elapsedTime: elapsedTime + 1 })
  }
}, 1000)
