import { create } from 'zustand'
import { IClient, IConversation } from '../models/contracts/Conversations'

const getUniqueClients = (conversations: IConversation[]): IClient[] => {
  const clients = conversations.map((conversation) => ({
    ...conversation.client,
    lastConversationDate: conversation.createdAt, // TODO: Fix this to actual last conversation date
  }))
  const uniqueIds = [...new Set(clients.map((client) => client.id))]
  const uniqueClients = clients.filter((client) => uniqueIds.includes(client.id))

  return uniqueClients
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
    set(() => ({ conversations, clients: getUniqueClients(conversations) })),
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
        clients: getUniqueClients(updatedConversations),
      }
    }),
}))
