import { FC } from 'react'
import { Amplify } from 'aws-amplify'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import '../styles.css'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
})

export const App: FC = () => {
  return <RouterProvider router={router} />
}
