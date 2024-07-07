import { FC } from 'react'
import { Avatar } from '../common/Avatar'
import { useConversationStore } from '../../stores/conversations'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'em %s',
    past: 'há %s',
    s: 'poucos segundos',
    m: 'um minuto',
    mm: '%d minutos',
    h: 'uma hora',
    hh: '%d horas',
    d: 'um dia',
    dd: '%d dias',
    M: 'um mês',
    MM: '%d meses',
    y: 'um ano',
    yy: '%d anos',
  },
})

export const Topbar: FC = () => {
  const conversations = useConversationStore((state) => state.conversations)
  const selectedConversation = useConversationStore((state) => state.selectedConversation)
  const conversationsFromClient = selectedConversation
    ? conversations.filter(
        (conversation) => conversation.client.id === selectedConversation.client.id,
      )
    : []
  const relatedConversationsCount = conversationsFromClient.length - 1

  return (
    <div className="flex-1 tw-flex tw-h-28 tw-px-9 tw-py-6 tw-bg-background-white tw-border-b tw-border-neutrals-200">
      {selectedConversation && (
        <Avatar fullName={selectedConversation.client.name} className="tw-size-8" />
      )}
      <div className="tw-ml-3 tw-flex-1 tw-flex tw-flex-col tw-justify-between">
        <h2 className="tw-text-neutrals-800 tw-font-medium tw-text-xl tw-leading-8">
          {selectedConversation ? selectedConversation.client.name : 'Nova anamnese'}
        </h2>
        <div className="tw-flex tw-flex-row tw-items-center">
          <p className="tw-text-neutrals-600">
            {selectedConversation ? dayjs().to(selectedConversation.createdAt) : 'Agora mesmo'}
          </p>
          {relatedConversationsCount > 0 && (
            <>
              <span className="tw-mx-2 tw-size-1 tw-rounded-full tw-bg-neutrals-400 tw-block" />
              <p className="tw-text-neutrals-400">{`+${relatedConversationsCount} anamnese${
                relatedConversationsCount > 1 ? 's' : ''
              }`}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
