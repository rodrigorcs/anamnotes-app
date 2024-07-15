import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { fetchAuthSession, signIn } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useAuthStore } from '../../../stores/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SignInFormFields,
  SignInFormSchema,
  TSignInFormData,
} from '../../../models/forms/SignInForm'

export const SignInForm: FC = () => {
  const formMethods = useForm<TSignInFormData>({
    resolver: zodResolver(SignInFormSchema),
  })

  const [isSigningIn, setIsSigningIn] = useState(false)

  const setAuthenticatedUserFromCognitoSession = useAuthStore(
    (state) => state.setAuthenticatedUserFromCognitoSession,
  )

  const handleSignIn = async ({ emailAddress, password }: TSignInFormData) => {
    setIsSigningIn(true)
    const { isSignedIn } = await signIn({
      username: emailAddress,
      password,
    })

    if (isSignedIn) {
      const authSession = await fetchAuthSession()
      setAuthenticatedUserFromCognitoSession(authSession)
    }
    setIsSigningIn(false)
  }

  const onSubmit = (formData: TSignInFormData) => handleSignIn(formData)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-mt-12">
        <Input
          id={SignInFormFields.emailAddress}
          title="E-mail"
          placeholder="exemplo@email.com"
          className="tw-mt-2"
          type="email"
          autoComplete="email"
        />
        <Input
          id={SignInFormFields.password}
          title="Senha"
          placeholder="Digite a sua senha"
          className="tw-mt-2"
          type="password"
          autoComplete="current-password"
        />
        <Button text="Entrar" type="submit" isLoading={isSigningIn} className="tw-mt-12" />
      </form>
    </FormProvider>
  )
}
