import { FC, useEffect } from 'react'
import '../styles.css'
import { Sidebar } from './components/sidebar'
import { Topbar } from './components/topbar'
import { MainContainer } from './components/common/containers/MainContainer'
import { ContentContainer } from './components/common/containers/ContentContainer'
import { RootContainer } from './components/common/containers/RootContainer'
import { Conversation } from './components/conversation'
import { useConversationStore } from './stores/conversations'
import { Summarization } from './components/summarization'
import { AnamnotesRestAPI } from './apis/anamnotesRest'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { SignUpPage } from './pages/SignUpPage'
import { ConfirmSignUpPage } from './pages/ConfirmSignUpPage'
import { SignInPage } from './pages/SignInPage'
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
})

export const App: FC = () => {
  const selectedConversation = useConversationStore((state) => state.selectedConversation)
  const updateConversations = useConversationStore((state) => state.updateConversations)

  const anamnotesRestAPI = new AnamnotesRestAPI()

  useEffect(() => {
    const execute = async () => {
      const allConversations = await anamnotesRestAPI.getAllConversations()
      updateConversations(allConversations)
    }

    execute()
  }, [])

  return (
    <RootContainer>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Sidebar />
                <MainContainer>
                  <Topbar />
                  <ContentContainer>
                    {selectedConversation ? <Summarization /> : <Conversation />}
                  </ContentContainer>
                </MainContainer>
              </>
            }
          />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="sign-up/confirm" element={<ConfirmSignUpPage />} />
          <Route path="sign-in" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </RootContainer>
  )
}
