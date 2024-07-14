import { IConversationWithSummarizations } from '../models/contracts/Conversations'
import { convertConversationContract, getAuthTokenFromCognitoSession } from './common'
import {
  EWebsocketMessageTypes,
  IWebsocketMessage,
  TSummarizationSuccessWebsocketMessage,
} from '../models/apis/websocket'

export class AnamnotesWebsocketAPI {
  private baseURL: string

  constructor() {
    const { VITE_ANAMNOTES_WEBSOCKET_BASE_URL } = import.meta.env

    this.baseURL = VITE_ANAMNOTES_WEBSOCKET_BASE_URL
  }

  private createWSConnection({
    conversationId,
    authToken,
  }: {
    conversationId: string
    authToken?: string
  }) {
    const wsURL = new URL(this.baseURL)

    wsURL.searchParams.append('conversationId', conversationId)
    if (authToken) wsURL.searchParams.append('idToken', authToken)

    return new WebSocket(wsURL)
  }

  public async getSummarizationMessage(conversationId: string) {
    const authToken = await getAuthTokenFromCognitoSession()
    const wsConnection = this.createWSConnection({ conversationId, authToken })

    return new Promise<IConversationWithSummarizations>(async (resolve, reject) => {
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

      wsConnection.onerror = (event) => {
        console.error(event)
        reject(event)
      }
    })
  }
}
