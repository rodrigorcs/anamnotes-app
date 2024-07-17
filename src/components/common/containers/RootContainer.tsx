import { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../../../stores/auth'
import { fetchAuthSession } from 'aws-amplify/auth'

export const RootContainer: FC = () => {
  const setAuthenticatedUserFromCognitoSession = useAuthStore(
    (state) => state.setAuthenticatedUserFromCognitoSession,
  )

  useEffect(() => {
    const execute = async () => {
      const authSession = await fetchAuthSession()
      setAuthenticatedUserFromCognitoSession(authSession)
    }

    execute()
  }, [])

  return (
    <div id="anamnotes-app-container" className="tw-flex">
      <Outlet />
    </div>
  )
}
