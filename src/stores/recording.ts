import { create } from 'zustand'

export enum ERecordingState {
  IDLE = 'idle',
  RECORDING = 'recording',
  WAITING_RESPONSE = 'waiting-response',
  SUCCESS = 'success',
}

interface IRecordingStore {
  recordingState: ERecordingState
  clientName: string | null
  setRecordingState: (recordingState: ERecordingState) => void
  setClientName: (clientName: string) => void
}

export const useRecordingStore = create<IRecordingStore>((set) => ({
  recordingState: ERecordingState.IDLE,
  clientName: null,
  setRecordingState: (recordingState: ERecordingState) => set(() => ({ recordingState })),
  setClientName: (clientName: string) => set(() => ({ clientName })),
}))
