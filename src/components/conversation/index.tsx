import { FC } from 'react'
import { NewConversation } from './NewConversation'
import { ConversationModal } from './ConversationModal'

export const Conversation: FC = () => {
  return (
    <div className="tw-flex tw-relative tw-flex-col tw-flex-1 tw-px-20 tw-py-12">
      <NewConversation />
      <ConversationModal />
    </div>
  )
}
