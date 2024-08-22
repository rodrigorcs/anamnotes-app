import { IConversationResponsePayload } from '../contracts/Conversations'

export enum EWebsocketMessageTypes {
  SUMMARIZATION = 'summarization',
}

export interface IWebsocketMessageError {
  message?: string | null
}

export interface IWebsocketMessage<DataType> {
  success: boolean
  type: EWebsocketMessageTypes
  data?: DataType | IWebsocketMessageError
  error?: IWebsocketMessageError
}

export interface ISuccessWebsocketMessage<DataType> extends IWebsocketMessage<DataType> {
  success: true
  data: DataType
  error: undefined
}

export type TSummarizationWebsocketMessage = IWebsocketMessage<IConversationResponsePayload>
export type TSummarizationSuccessWebsocketMessage =
  ISuccessWebsocketMessage<IConversationResponsePayload>
