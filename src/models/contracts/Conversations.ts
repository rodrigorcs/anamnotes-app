import { Dayjs } from 'dayjs'
import { ISummarization, ISummarizationResponsePayload } from './Summarization'

export interface IClient {
  id: string
  name: string
}

export interface IConversation {
  id: string
  userId: string
  client: IClient
  summarizations: ISummarization[]
  createdAt: Dayjs
  updatedAt?: Dayjs
}

export interface IConversationResponsePayload
  extends Omit<IConversation, 'createdAt' | 'updatedAt' | 'summarizations'> {
  summarizations: ISummarizationResponsePayload[]
  createdAt: string
  updatedAt?: string
}

export interface IConversationResponse {
  conversation: IConversationResponsePayload
}

export interface IConversationsResponse {
  conversations: IConversationResponsePayload[]
}
