import { FC, useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { ConversationHeader } from './ConversationHeader'
import { ContentContainer } from '../common/containers/ContentContainer'
import { useConversationStore } from '../../stores/conversations'
import { AnamnotesRestAPI } from '../../apis/anamnotesRest'
import { useFeedback } from '../../hooks/useFeedback'

export interface IConversationContainerContext {
  feedback: ReturnType<typeof useFeedback>['feedback']
}

export const ConversationContainer: FC = () => {
  const navigate = useNavigate()
  const { conversationId } = useParams()

  const { feedback, setFeedback, clearFeedback } = useFeedback()

  const conversations = useConversationStore((state) => state.conversations)
  const setConversations = useConversationStore((state) => state.setConversations)
  const setSelectedConversation = useConversationStore((state) => state.setSelectedConversation)

  const anamnotesRestAPI = new AnamnotesRestAPI()

  useEffect(() => {
    const fetchConversations = async () => {
      const allConversations = await anamnotesRestAPI.getAllConversations()
      setConversations(allConversations)
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (!conversationId) return

    const conversation = conversations.find((conversation) => conversation.id === conversationId)
    if (!conversation) {
      navigate('/app/conversations')
      return
    }

    setSelectedConversation(conversation)

    const fetchConversationWithSummarizations = async () => {
      clearFeedback()
      try {
        const conversationWithSummarizations = await anamnotesRestAPI.getConversation(
          conversationId,
        )
        setSelectedConversation(conversationWithSummarizations)

        if (!conversationWithSummarizations.summarizations?.length) {
          setFeedback({
            type: 'warning',
            title: 'Não há dados suficientes.',
            message:
              'Não foi gerado o resumo desta anamnese devido à pouca informação durante a sessão.',
          })
        }
      } catch (error) {
        setFeedback({
          type: 'error',
          title: 'Erro ao carregar a anamnese.',
          message: 'Ocorreu um erro ao tentar carregar a anamnese. Por favor, tente novamente.',
        })
      }
    }

    fetchConversationWithSummarizations()
  }, [conversationId])

  return (
    <div className="tw-flex tw-flex-col tw-flex-1 tw-bg-background-white">
      <ConversationHeader />
      <ContentContainer>
        <Outlet context={{ feedback }} />
      </ContentContainer>
    </div>
  )
}
