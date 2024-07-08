import { IConversationWithSummarizations } from '../models/contracts/Conversations'
import { convertConversationContract } from './common'
import {
  EWebsocketMessageTypes,
  IWebsocketMessage,
  TSummarizationSuccessWebsocketMessage,
} from '../models/apis/websocket'

export class AnamnotesWebsocketAPI {
  private baseURL: string

  constructor() {
    this.baseURL = 'wss://ws.anamnotes.com'
  }

  private createWSConnection(conversationId: string) {
    const wsURL = new URL(this.baseURL)
    wsURL.searchParams.append('conversationId', conversationId)

    return new WebSocket(wsURL)
  }

  public async getSummarizationMessage(conversationId: string) {
    return new Promise<IConversationWithSummarizations>((resolve, reject) => {
      const wsConnection = this.createWSConnection(conversationId)

      wsConnection.onmessage = (event) => {
        const message = JSON.parse(event.data) as IWebsocketMessage<unknown>
        if (message.type !== EWebsocketMessageTypes.SUMMARIZATION) return
        if (wsConnection.readyState === wsConnection.OPEN) wsConnection.close()

        if (message.success && message.data) {
          const conversation = convertConversationContract(
            (message as TSummarizationSuccessWebsocketMessage).data,
          )
          resolve(conversation)
        } else {
          reject(message.error)
        }
      }

      wsConnection.onerror = (error) => {
        reject(error)
      }
    })
  }
}
