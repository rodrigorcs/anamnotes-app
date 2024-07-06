import { useEffect, useState } from 'react'
import { TSection } from './models/contracts/sections'
import '../styles.css'
import { Sidebar } from './components/sidebar'
import { Topbar } from './components/topbar'
import { MainContainer } from './components/containers/MainContainer'
import { ContentContainer } from './components/containers/ContentContainer'
import { RootContainer } from './components/containers/RootContainer'
import { Conversation } from './components/conversation'

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
    <RootContainer>
      <Sidebar />
      <MainContainer>
        <Topbar />
        <ContentContainer>
          <Conversation />
          {/* <Summarization /> */}
        </ContentContainer>
      </MainContainer>
    </RootContainer>
  )
}

export default App
