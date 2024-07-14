import { AuthSession } from 'aws-amplify/auth'
import { create } from 'zustand'
import { TAuthenticatedUser, parseAuthenticatedUser } from '../models/contracts/User'

export interface ILoginData {
  fullName: string
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
  } catch {
    return null
  }
}

interface IAuthStore {
  loginData: ILoginData | null
  user: TAuthenticatedUser | null
  setLoginData: (data: ILoginData) => void
  setAuthenticatedUserFromCognitoSession: (cognitoSession: AuthSession) => void
}

const INITIAL_STATE: Pick<IAuthStore, 'loginData' | 'user'> = {
  loginData: null,
  user: null,
} as const

export const useAuthStore = create<IAuthStore>((set) => ({
  ...INITIAL_STATE,
  setLoginData: ({ fullName, emailAddress }: ILoginData) =>
    set(() => ({ loginData: { fullName, emailAddress } })),
  setAuthenticatedUserFromCognitoSession: (cognitoSession: AuthSession) => {
    const user = getUserDataFromCognitoSession(cognitoSession)
    if (user) set(() => ({ user }))
  },
}))
