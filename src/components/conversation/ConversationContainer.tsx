import { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ConversationHeader } from './ConversationHeader'
import { ContentContainer } from '../common/containers/ContentContainer'
import { useConversationStore } from '../../stores/conversations'
import { AnamnotesRestAPI } from '../../apis/anamnotesRest'

export const ConversationContainer: FC = () => {
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
    <div className="tw-flex tw-flex-col tw-flex-1 tw-bg-background-white">
      <ConversationHeader />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </div>
  )
}
