import { Dayjs } from 'dayjs'
import { ISummarization, ISummarizationResponsePayload } from './Summarization'

export interface IClientResponse {
  id: string
  name: string
}

export interface IClient extends IClientResponse {
  lastConversationDate: Dayjs
}

export interface IConversation {
  id: string
  userId: string
  client: IClientResponse
  createdAt: Dayjs
  updatedAt?: Dayjs
}

export interface IConversationWithSummarizations extends IConversation {
  summarizations?: Pick<ISummarization, 'id' | 'content' | 'createdAt' | 'updatedAt'>[]
}

export interface IConversationResponsePayload
  extends Omit<IConversation, 'createdAt' | 'updatedAt' | 'summarizations' | 'client'> {
  client: IClientResponse
  createdAt: string
  updatedAt?: string
}

export interface IConversationWithSummarizationResponsePayload
  extends IConversationResponsePayload {
  summarizations: ISummarizationResponsePayload[]
}

export interface IConversationResponse {
  conversation: IConversationWithSummarizationResponsePayload
}

export interface IConversationsResponse {
  conversations: IConversationResponsePayload[]
}

export interface ICreateConversationResponse {
  conversationId: string
}
