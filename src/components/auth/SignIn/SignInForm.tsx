import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { fetchAuthSession, signIn } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useAuthStore } from '../../../stores/auth'

interface IFormFields {
  emailAddress: string
  password: string
}
type FormFieldKeys = keyof IFormFields

const FormFields: { [key in FormFieldKeys]: key } = {
  emailAddress: 'emailAddress',
  password: 'password',
} as const

export const SignInForm: FC = () => {
  const formMethods = useForm<IFormFields>()

  const [isSigningIn, setIsSigningIn] = useState(false)

  const setAuthenticatedUserFromCognitoSession = useAuthStore(
    (state) => state.setAuthenticatedUserFromCognitoSession,
  )

  const handleSignIn = async ({ emailAddress, password }: IFormFields) => {
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

  const onSubmit = (formData: IFormFields) => handleSignIn(formData)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-mt-12">
        <Input
          id={FormFields.emailAddress}
          register={formMethods.register}
          title="E-mail"
          placeholder="exemplo@email.com"
          className="tw-mt-2"
        />
        <Input
          id={FormFields.password}
          register={formMethods.register}
          title="Senha"
          placeholder="Digite a sua senha"
          className="tw-mt-2"
        />
        <Button text="Entrar" type="submit" isLoading={isSigningIn} className="tw-mt-12" />
      </form>
    </FormProvider>
  )
}
