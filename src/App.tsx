import { RecordButton } from './components/RecordButton'
import styles from '../styles.css?inline'
import { ResultsModal } from './components/ResultsModal'
import { useEffect, useState } from 'react'
import { TSection } from './models/contracts/sections'

export enum ERecordingState {
  IDLE = 'idle',
  RECORDING = 'recording',
  WAITING_RESPONSE = 'waiting-response',
  SUCCESS = 'success',
}

export enum EModals {
  RESULTS = 'results',
}

function App(props: unknown) {
  const [recordingState, setRecordingState] = useState<ERecordingState>(ERecordingState.IDLE)
  const [activeModal, setActiveModal] = useState<EModals | null>(null)
  const [isModalExpanded, setIsModalExpanded] = useState<boolean>(false)
  const [sections, setSections] = useState<TSection[]>([])

  useEffect(() => {
    if (recordingState === ERecordingState.SUCCESS) {
      setActiveModal(EModals.RESULTS)

      setTimeout(() => {
        setRecordingState(ERecordingState.IDLE)
      }, 2000)
    }
  }, [recordingState])

  useEffect(() => {
    setIsModalExpanded(!!activeModal)
  }, [activeModal])

  return (
    <>
      <style>{styles}</style>
      <div className="tw-flex tw-flex-col tw-justify-end tw-items-end tw-fixed tw-bottom-8 tw-right-8 tw-z-[9999]">
        <ResultsModal
          isExpanded={activeModal === EModals.RESULTS && isModalExpanded}
          collapseModal={() => setIsModalExpanded(false)}
          sections={sections}
        />
        <RecordButton
          recordingState={recordingState}
          setRecordingState={setRecordingState}
          isModalActive={!!activeModal}
          isModalExpanded={isModalExpanded}
          closeModal={() => {
            setActiveModal(null)
            setSections([])
          }}
          expandModal={() => setIsModalExpanded(true)}
          setSections={setSections}
        />
      </div>
    </>
  )
}

export default App
