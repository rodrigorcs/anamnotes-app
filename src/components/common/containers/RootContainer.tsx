import { FC, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/auth'
import { fetchAuthSession } from 'aws-amplify/auth'

export const RootContainer: FC = () => {
  const navigate = useNavigate()
  const { pathname: path } = useLocation()
  const rootPath = path.split('/')[1]

  const user = useAuthStore((state) => state.user)
  const setAuthenticatedUserFromCognitoSession = useAuthStore(
    (state) => state.setAuthenticatedUserFromCognitoSession,
  )

  useEffect(() => {
    const execute = async () => {
      const authSession = await fetchAuthSession()
      console.log({ authSession })
      setAuthenticatedUserFromCognitoSession(authSession)
    }
    execute()
  }, [])

  useEffect(() => {
    console.log({ user })
    if (rootPath === 'app' && !user) return navigate('/auth')
    if (rootPath === 'auth' && user) return navigate('/app')
  }, [user])

  return (
    <div id="anamnotes-app-container" className="tw-flex">
      <Outlet />
    </div>
  )
}
