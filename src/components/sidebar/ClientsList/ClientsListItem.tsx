import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../../utils/className'
import { Avatar } from '../../common/Avatar'
import { IClient } from '../../../models/contracts/Conversations'
import { useConversationStore } from '../../../stores/conversations'
import { useNavigate, useParams } from 'react-router-dom'

interface IProps {
  client: IClient
  isFirstItem?: boolean
  className?: ClassNameValue
}

export const ClientsListItem: FC<IProps> = ({ client, isFirstItem, className }) => {
  const navigate = useNavigate()

  const conversations = useConversationStore((state) => state.conversations)
  const selectedConversation = useConversationStore((state) => state.selectedConversation)
  const isSelected = client.id === selectedConversation?.client.id

  const handleSelectConversation = () => {
    const latestConversationFromClient = conversations.find(
      (conversation) => conversation.client.id === client.id,
    )

    navigate(`conversations/${latestConversationFromClient?.id}`)
  }

  return (
    <div
      className={cn(
        'tw-flex tw-items-center tw-p-1 tw-rounded-full hover:tw-bg-background-200 tw-cursor-pointer tw-transition-colors',
        isSelected && 'tw-bg-brand-100 hover:tw-bg-brand-100 tw-font-medium',
        !isFirstItem && 'tw-mt-1',
        className,
      )}
      onClick={handleSelectConversation}
    >
      <Avatar fullName={client.name} />
      <p className="tw-ml-2 tw-text-neutrals-700 tw-text-sm tw-text-ellipsis tw-text-nowrap tw-overflow-hidden tw-whitespace-nowrap">
        {client.name}
      </p>
    </div>
  )
}
