import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RootContainer } from './components/common/containers/RootContainer'
import { AuthContainer } from './components/auth/AuthContainer'
import { SignInContent } from './components/auth/SignIn'
import { SignUpContent } from './components/auth/SignUp'
import { ConfirmSignUpContent } from './components/auth/ConfirmSignUp'
import { AuthorizedContainer } from './components/common/containers/AuthorizedContainer'
import { ConversationContainer } from './components/conversation/ConversationContainer'
import { Conversation } from './components/conversation'
import { Summarization } from './components/summarization'
import { ForgotPasswordContent } from './components/auth/ForgotPassword'
import { ResetPasswordContent } from './components/auth/ResetPassword'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootContainer />,
    children: [
      { index: true, element: <Navigate to="auth" replace /> },
      {
        path: 'auth',
        element: <AuthContainer />,
        children: [
          { index: true, element: <Navigate to="sign-in" replace /> },
          { path: 'sign-in', element: <SignInContent /> },
          {
            path: 'sign-up',
            element: <SignUpContent />,
          },
          {
            path: 'sign-up/confirm',
            element: <ConfirmSignUpContent />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordContent />,
          },
          {
            path: 'forgot-password/reset',
            element: <ResetPasswordContent />,
          },
        ],
      },
      {
        path: 'app',
        element: <AuthorizedContainer />,
        children: [
          { index: true, element: <Navigate to="conversations" replace /> },
          {
            path: 'conversations',
            element: <ConversationContainer />,
            children: [
              { index: true, element: <Navigate to="new" replace /> },
              { path: 'new', element: <Conversation /> },
              { path: ':conversationId', element: <Summarization /> },
            ],
          },
        ],
      },
    ],
  },
])
