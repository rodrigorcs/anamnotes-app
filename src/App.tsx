import { FC, useEffect, useState } from 'react'
import '../styles.css'
import { Sidebar } from './components/sidebar'
import { Topbar } from './components/topbar'
import { MainContainer } from './components/containers/MainContainer'
import { ContentContainer } from './components/containers/ContentContainer'
import { RootContainer } from './components/containers/RootContainer'
import { Conversation } from './components/conversation'
import { useConversationStore } from './stores/conversations'
import { Summarization } from './components/summarization'
import { AnamnotesRestAPI } from './apis/anamnotesRest'

export const App: FC = () => {
  const selectedConversation = useConversationStore((state) => state.selectedConversation)
  const updateConversations = useConversationStore((state) => state.updateConversations)

  const anamnotesRestAPI = new AnamnotesRestAPI()

  useEffect(() => {
    const execute = async () => {
      const allConversations = await anamnotesRestAPI.getAllConversations()
      updateConversations(allConversations)
    }

    execute()
  }, [])

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
