import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { AuthError, fetchAuthSession, signIn, signInWithRedirect } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useAuthStore } from '../../../stores/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SignInFormFields,
  SignInFormSchema,
  TSignInFormData,
} from '../../../models/forms/SignInForm'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../common/Alert'
import { useFeedback } from '../../../hooks/useFeedback'
import googleLogoVector from '/assets/vectors/logo-google.svg'

export const SignInForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<TSignInFormData>({
    resolver: zodResolver(SignInFormSchema),
  })

  const [isSigningIn, setIsSigningIn] = useState(false)
  const { feedback, setFeedback, setUnexpectedError } = useFeedback()

  const setAuthenticatedUserFromCognitoSession = useAuthStore(
    (state) => state.setAuthenticatedUserFromCognitoSession,
  )

  const handleSignIn = async ({ emailAddress, password }: TSignInFormData) => {
    setIsSigningIn(true)
    try {
      const { isSignedIn } = await signIn({
        username: emailAddress,
        password,
      })

      if (isSignedIn) {
        const authSession = await fetchAuthSession()
        const authenticatedUser = setAuthenticatedUserFromCognitoSession(authSession)
        return authenticatedUser
      }
    } catch (error) {
      if (error instanceof AuthError) {
        if (['UserNotFoundException', 'NotAuthorizedException'].includes(error.name)) {
          setFeedback({
            type: 'error',
            message: 'E-mail ou senha informados estão incorretos.',
          })
          return
        }
      }
      setUnexpectedError()
    } finally {
      setIsSigningIn(false)
    }
  }

  const onSubmit = (formData: TSignInFormData) => handleSignIn(formData)

  return (
    <div className="tw-flex tw-flex-col">
      <Alert feedback={feedback} className="tw-mb-4" />
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col">
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
          <Button
            text="Esqueci minha senha"
            variant="tertiary"
            size="fit"
            className="tw-mt-2 tw-self-end"
            textClassName="tw-text-xs hover:tw-underline"
            onClick={() => {
              navigate('../forgot-password')
            }}
          />
          <Button
            text="Entrar"
            type="submit"
            isLoading={isSigningIn}
            className="tw-mt-12 tw-shadow-none"
          />
          <Button
            IconLeft={
              <img src={googleLogoVector} alt="Google Logo" className="tw-h-5 tw-aspect-square" />
            }
            text="Entrar com Google"
            className="tw-mt-3 tw-bg-background-white tw-border tw-border-neutrals-200 hover:tw-border-neutrals-400"
            textClassName="tw-text-neutrals-600 group-hover:tw-text-neutrals-900"
            variant="secondary"
            onClick={() => signInWithRedirect({ provider: 'Google' })}
          />
        </form>
      </FormProvider>
    </div>
  )
}
