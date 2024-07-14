import { createBrowserRouter } from 'react-router-dom'
import { RootContainer } from './components/common/containers/RootContainer'
import { AuthContainer } from './components/auth/AuthContainer'
import { SignInContent } from './components/auth/SignIn'
import { SignUpContent } from './components/auth/SignUp'
import { ConfirmSignUpContent } from './components/auth/ConfirmSignUp'
import { AuthorizedContainer } from './components/common/containers/AuthorizedContainer'
import { ConversationContainer } from './components/conversation/ConversationContainer'
import { Conversation } from './components/conversation'
import { Summarization } from './components/summarization'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootContainer />,
    children: [
      {
        path: 'auth',
        element: <AuthContainer />,
        children: [
          { path: 'sign-in', element: <SignInContent /> },
          {
            path: 'sign-up',
            element: <SignUpContent />,
            children: [{ path: 'confirm', element: <ConfirmSignUpContent /> }],
          },
        ],
      },
      {
        path: 'app',
        element: <AuthorizedContainer />,
        children: [
          {
            path: 'conversations',
            element: <ConversationContainer />,
            children: [
              { path: 'new', element: <Conversation /> },
              { path: ':conversationId', element: <Summarization /> },
            ],
          },
        ],
      },
    ],
  },
])
