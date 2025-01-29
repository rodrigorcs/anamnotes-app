import { FC } from 'react'
import { Amplify } from 'aws-amplify'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import '../styles.css'
import { config } from './config'

const redirectBaseURL = config.isLocal ? config.localURL : config.baseURL

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          providers: ['Google'],
          scopes: ['email', 'openid', 'profile'],
          responseType: 'code',
          domain: config.aws.cognito.domain,
          redirectSignIn: [`${redirectBaseURL}/`],
          redirectSignOut: [`${redirectBaseURL}/`],
        },
      },
    },
  },
})

export const App: FC = () => {
  return <RouterProvider router={router} />
}
