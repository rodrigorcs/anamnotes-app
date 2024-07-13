import { create } from 'zustand'

interface IAuthStore {
  fullName: string | null
  emailAddress: string | null
  setLoginData: (data: Pick<IAuthStore, 'fullName' | 'emailAddress'>) => void
}

const INITIAL_STATE: Pick<IAuthStore, 'fullName' | 'emailAddress'> = {
  fullName: null,
  emailAddress: null,
} as const

export const useAuthStore = create<IAuthStore>((set) => ({
  ...INITIAL_STATE,
  setLoginData: ({ fullName, emailAddress }: Pick<IAuthStore, 'fullName' | 'emailAddress'>) =>
    set(() => ({ fullName, emailAddress })),
}))
