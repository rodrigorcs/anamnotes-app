import { create } from 'zustand'
import {
  IClient,
  IConversation,
  IConversationWithSummarizations,
} from '../models/contracts/Conversations'

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
  clients: IClient[] | null
  selectedConversation: IConversation | IConversationWithSummarizations | null
  setConversations: (conversations: IConversation[]) => void
  setSelectedConversation: (conversation: IConversation | IConversationWithSummarizations) => void
  clearConversationSelection: () => void
  addConversation: (conversation: IConversation) => void
  clearConversationsState: () => void
}

const INITIAL_STATE: Pick<
  IConversationStore,
  'conversations' | 'clients' | 'selectedConversation'
> = {
  conversations: [],
  clients: [],
  selectedConversation: null,
} as const

export const useConversationStore = create<IConversationStore>((set) => ({
  ...INITIAL_STATE,
  setConversations: (conversations: IConversation[]) =>
    set(() => ({ conversations, clients: extractClientsWithLastConversationDate(conversations) })),
  setSelectedConversation: async (conversation: IConversation | IConversationWithSummarizations) =>
    set(() => ({
      selectedConversation: conversation,
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

  clearConversationsState: () => set(INITIAL_STATE),
}))
