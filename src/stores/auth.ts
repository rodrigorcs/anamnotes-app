import { AuthSession } from 'aws-amplify/auth'
import { create } from 'zustand'
import { TAuthenticatedUser, parseAuthenticatedUser } from '../models/contracts/User'

export interface ILoginData {
  fullName: string
  emailAddress: string
}

export interface IResetPasswordData {
  emailAddress: string
}

const getUserDataFromCognitoSession = (cognitoSession: AuthSession): TAuthenticatedUser | null => {
  const idTokenPayload = cognitoSession.tokens?.idToken?.payload
  if (!idTokenPayload) return null

  const userData = {
    id: idTokenPayload['cognito:username'],
    fullName: idTokenPayload.name,
    emailAddress: idTokenPayload.email,
    isEmailVerified: idTokenPayload.email_verified,
  }

  try {
    return parseAuthenticatedUser(userData)
  } catch (error) {
    return null
  }
}

interface IAuthStore {
  loginData: ILoginData | null
  resetPasswordData: IResetPasswordData | null
  user: TAuthenticatedUser | null
  hasFetchedAuthSession: boolean
  setLoginData: (data: ILoginData) => void
  setResetPasswordData: (data: IResetPasswordData) => void
  setAuthenticatedUserFromCognitoSession: (cognitoSession: AuthSession) => void
  clearUser: () => void
}

const INITIAL_STATE: Pick<
  IAuthStore,
  'loginData' | 'resetPasswordData' | 'user' | 'hasFetchedAuthSession'
> = {
  loginData: null,
  resetPasswordData: null,
  user: null,
  hasFetchedAuthSession: false,
} as const

export const useAuthStore = create<IAuthStore>((set) => ({
  ...INITIAL_STATE,

  setLoginData: ({ fullName, emailAddress }: ILoginData) =>
    set(() => ({ loginData: { fullName, emailAddress } })),

  setResetPasswordData: ({ emailAddress }: IResetPasswordData) =>
    set(() => ({ resetPasswordData: { emailAddress } })),

  setAuthenticatedUserFromCognitoSession: (cognitoSession: AuthSession) => {
    const user = getUserDataFromCognitoSession(cognitoSession)
    if (user) set(() => ({ user, hasFetchedAuthSession: true }))
  },

  clearUser: () => {
    set(() => ({ user: null }))
  },
}))
