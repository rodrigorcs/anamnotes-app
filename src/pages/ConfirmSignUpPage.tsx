import { FC } from 'react'
import { LoginContainer } from '../components/login/LoginContainer'
import { ConfirmSignUpContent } from '../components/login/ConfirmSignUp'

export const ConfirmSignUpPage: FC = () => {
  return (
    <LoginContainer>
      <ConfirmSignUpContent />
    </LoginContainer>
  )
}
