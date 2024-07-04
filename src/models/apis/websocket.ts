export enum EWebsocketMessageTypes {
  SUMMARIZATION = 'summarization',
}

interface IWebsocketMessageError {
  message: string | null
}

interface IWebsocketMessage<DataType> {
  success: boolean
  type: EWebsocketMessageTypes
  data?: DataType
  error?: IWebsocketMessageError
}

export type TSummarizationWebsocketMessage = IWebsocketMessage<{
  conversationId: string
  content: {
    slug: string
    content: string
  }[]
}>
