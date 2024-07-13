import { FC } from 'react'
import { LoginContainer } from '../components/login/LoginContainer'
import { SignInContent } from '../components/login/SignIn'

export const SignInPage: FC = () => {
  return (
    <LoginContainer>
      <SignInContent />
    </LoginContainer>
  )
}
