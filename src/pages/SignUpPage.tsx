import { FC } from 'react'
import { SignUpContent } from '../components/login/SignUp'
import { LoginContainer } from '../components/login/LoginContainer'

export const SignUpPage: FC = () => {
  return (
    <LoginContainer>
      <SignUpContent />
    </LoginContainer>
  )
}
