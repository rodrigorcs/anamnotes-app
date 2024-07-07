import { create } from 'zustand'
import { IClient, IConversation } from '../models/contracts/Conversations'

const extractClientsWithLastConversationDate = (conversations: IConversation[]): IClient[] => {
  const clientMap = new Map<string, IClient>()

  conversations.forEach((conversation) => {
    const { client, createdAt } = conversation

    const existingClient = clientMap.get(client.id)
    if (existingClient) {
      if (createdAt.isAfter(existingClient.lastConversationDate)) {
        existingClient.lastConversationDate = createdAt
      }
    } else {
      clientMap.set(client.id, {
        ...client,
        lastConversationDate: createdAt,
      })
    }
  })

  return Array.from(clientMap.values())
}

interface IConversationStore {
  conversations: IConversation[]
  clients: IClient[]
  selectedConversation: IConversation | null
  updateConversations: (conversations: IConversation[]) => void
  selectConversation: (conversationId: string) => void
  selectLatestConversationByClientId: (clientId: string) => void
  clearConversationSelection: () => void
  addConversation: (conversation: IConversation) => void
}

export const useConversationStore = create<IConversationStore>((set) => ({
  conversations: [],
  clients: [],
  selectedConversation: null,
  updateConversations: (conversations: IConversation[]) =>
    set(() => ({ conversations, clients: extractClientsWithLastConversationDate(conversations) })),
  selectConversation: (conversationId: string) =>
    set((state) => ({
      selectedConversation:
        state.conversations.find((conversation) => conversation.id === conversationId) ?? null,
    })),
  selectLatestConversationByClientId: (clientId: string) =>
    set((state) => ({
      selectedConversation:
        state.conversations.find((conversation) => conversation.client.id === clientId) ?? null,
    })),
  clearConversationSelection: () => set({ selectedConversation: null }),
  addConversation: (conversation: IConversation) =>
    set((state) => {
      const updatedConversations = [conversation, ...state.conversations]
      return {
        conversations: updatedConversations,
        clients: extractClientsWithLastConversationDate(updatedConversations),
      }
    }),
}))
