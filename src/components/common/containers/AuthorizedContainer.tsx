import { FC } from 'react'
import { Sidebar } from '../../sidebar'
import { Outlet } from 'react-router-dom'

export const AuthorizedContainer: FC = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  )
}
