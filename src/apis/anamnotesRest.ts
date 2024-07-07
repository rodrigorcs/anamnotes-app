import axios from 'axios'

const BASE_URL = 'https://api.anamnotes.com'

export const Endpoints = {
  CONVERSATIONS: '/v1/conversations',
  CONVERSATION: (conversationId: string) => `/v1/conversations/${conversationId}`,
  UPLOAD_URL: (conversationId: string, audioChunkId: string) =>
    `/v1/conversations/${conversationId}/audioChunks/${audioChunkId}/uploadUrl`,
} as const

export const anamnotesAPI = axios.create({
  baseURL: BASE_URL,
})
