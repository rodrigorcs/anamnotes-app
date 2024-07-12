import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  IConversationResponse,
  IConversationsResponse,
  ICreateConversationResponse,
} from '../models/contracts/Conversations'
import {
  convertConversationContract,
  convertConversationWithSummarizationsContract,
} from './common'

export class AnamnotesRestAPI {
  private axiosClient: AxiosInstance
  private Endpoints = Object.freeze({
    CONVERSATIONS: '/v1/conversations',
    CONVERSATION: (conversationId: string) => `/v1/conversations/${conversationId}`,
    UPLOAD_URL: (conversationId: string, audioChunkId: string) =>
      `/v1/conversations/${conversationId}/audioChunks/${audioChunkId}/uploadUrl`,
  })

  constructor() {
    const { VITE_ANAMNOTES_REST_BASE_URL } = import.meta.env

    this.axiosClient = axios.create({
      baseURL: VITE_ANAMNOTES_REST_BASE_URL,
    })
  }

  public async getAllConversations() {
    const response = (await this.axiosClient.get(
      this.Endpoints.CONVERSATIONS,
    )) as AxiosResponse<IConversationsResponse>

    const conversations = response.data.conversations
      .map((conversation) => convertConversationContract(conversation))
      .sort((a, b) => b.createdAt.diff(a.createdAt))

    return conversations
  }

  public async getConversation(id: string) {
    const response = (await this.axiosClient.get(
      this.Endpoints.CONVERSATION(id),
    )) as AxiosResponse<IConversationResponse>

    const conversation = convertConversationWithSummarizationsContract(response.data.conversation)
    return conversation
  }

  public async createConversation({ clientName }: { clientName: string }) {
    const response = (await this.axiosClient.post(this.Endpoints.CONVERSATIONS, {
      client: {
        name: clientName,
      },
    })) as AxiosResponse<ICreateConversationResponse>

    return response.data.conversationId
  }

  public async getAudioChunkUploadURL({
    conversationId,
    audioChunkId,
    isLastChunk,
  }: {
    conversationId: string
    audioChunkId: string
    isLastChunk: boolean
  }) {
    const response = await this.axiosClient.get(
      this.Endpoints.UPLOAD_URL(conversationId, audioChunkId),
      {
        params: {
          isLastChunk,
        },
      },
    )

    return response.data.signedUrl
  }

  public async uploadAudioChunk({
    signedURL,
    audioChunkBlob,
  }: {
    signedURL: string
    audioChunkBlob: Blob
  }) {
    return axios.put(signedURL, audioChunkBlob)
  }
}
