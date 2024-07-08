import dayjs from 'dayjs'
import {
  IConversation,
  IConversationResponsePayload,
  IConversationWithSummarizationResponsePayload,
  IConversationWithSummarizations,
} from '../models/contracts/Conversations'

export const convertConversationContract = (
  conversation: IConversationResponsePayload,
): IConversation => {
  return {
    ...conversation,
    createdAt: dayjs(conversation.createdAt),
    updatedAt: conversation.updatedAt ? dayjs(conversation.updatedAt) : undefined,
  }
}

export const convertConversationWithSummarizationsContract = (
  conversation: IConversationWithSummarizationResponsePayload,
): IConversationWithSummarizations => {
  return {
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
  }
}
