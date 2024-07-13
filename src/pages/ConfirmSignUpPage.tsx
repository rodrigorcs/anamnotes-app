import { FC } from 'react'
import { Amplify } from 'aws-amplify'
import { LoginContainer } from '../components/login/LoginContainer'
import { ConfirmSignUpContent } from '../components/login/ConfirmSignUp'

export const ConfirmSignUpPage: FC = () => {
  return (
    <LoginContainer>
      <ConfirmSignUpContent />
    </LoginContainer>
  )
}
