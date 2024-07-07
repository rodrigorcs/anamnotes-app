import { useEffect, useState } from 'react'
import '../styles.css'
import { Sidebar } from './components/sidebar'
import { Topbar } from './components/topbar'
import { MainContainer } from './components/containers/MainContainer'
import { ContentContainer } from './components/containers/ContentContainer'
import { RootContainer } from './components/containers/RootContainer'
import { Conversation } from './components/conversation'
import { Endpoints, anamnotesAPI } from './apis/anamnotesRest'
import { IConversationsResponse } from './models/contracts/Conversations'
import dayjs from 'dayjs'
import { useConversationStore } from './stores/conversations'
import { Summarization } from './components/summarization'
import { ERecordingState } from './stores/recording'

export enum EModals {
  RESULTS = 'results',
}

function App() {
  const [recordingState, setRecordingState] = useState<ERecordingState>(ERecordingState.IDLE)
  const [activeModal, setActiveModal] = useState<EModals | null>(null)
  const [isModalExpanded, setIsModalExpanded] = useState<boolean>(false)
  const selectedConversation = useConversationStore((state) => state.selectedConversation)
  const updateConversations = useConversationStore((state) => state.updateConversations)

  useEffect(() => {
    const execute = async () => {
      const response = await anamnotesAPI.get<IConversationsResponse>(Endpoints.CONVERSATIONS)
      const conversations = response.data.conversations
        .map((conversation) => ({
          ...conversation,
          createdAt: dayjs(conversation.createdAt),
          updatedAt: conversation.updatedAt ? dayjs(conversation.updatedAt) : undefined,
          summarizations: conversation.summarizations
            .map((summarization) => ({
              ...summarization,
              createdAt: dayjs(summarization.createdAt),
              updatedAt: summarization.updatedAt ? dayjs(summarization.updatedAt) : undefined,
            }))
            .sort((a, b) => b.createdAt.diff(a.createdAt)),
        }))
        .sort((a, b) => b.createdAt.diff(a.createdAt))

      updateConversations(conversations)
    }

    execute()
  }, [])

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
          {selectedConversation ? <Summarization /> : <Conversation />}
        </ContentContainer>
      </MainContainer>
    </RootContainer>
  )
}

export default App
