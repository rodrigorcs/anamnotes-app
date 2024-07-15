import { FC, useEffect } from 'react'
import { Sidebar } from '../../sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/auth'

export const AuthorizedContainer: FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const hasFetchedAuthSession = useAuthStore((state) => state.hasFetchedAuthSession)

  useEffect(() => {
    if (hasFetchedAuthSession && !user) navigate('/auth')
  }, [user])

  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  )
}
