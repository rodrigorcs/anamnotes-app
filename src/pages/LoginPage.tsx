import { FC, useState } from 'react'
import { Amplify } from 'aws-amplify'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { confirmSignUp, signIn, signUp } from 'aws-amplify/auth'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_PKVQglcmv',
      userPoolClientId: 'ipshdl7vcckp8ac6gtkrpb6gs',
    },
  },
})

export const LoginPage: FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOTP] = useState('')

  const handleSignUp = async () => {
    return signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email,
          name,
        },
      },
    })
  }

  const handleConfirmSignUp = async () => {
    return confirmSignUp({
      username: email,
      confirmationCode: otp,
    })
  }

  const handleSignIn = async () => {
    return signIn({
      username: email,
      password: password,
    })
  }

  return (
    <div className="tw-flex tw-flex-col tw-p-8">
      <Input
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="tw-mt-2"
      />
      <Input
        placeholder="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="tw-mt-4"
      />
      <Input
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="tw-mt-2"
      />
      <Input
        placeholder="OTP"
        value={otp}
        onChange={(event) => setOTP(event.target.value)}
        className="tw-mt-4"
      />
      <Button className="tw-mt-4" onClick={handleSignUp} text="Sign Up" />
      <Button className="tw-mt-4" onClick={handleConfirmSignUp} text="Confirm Sign Up" />
      <Button className="tw-mt-4" onClick={handleSignIn} text="Sign In" />
    </div>
  )
}
