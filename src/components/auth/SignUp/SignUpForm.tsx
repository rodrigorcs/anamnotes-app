import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { signUp } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useAuthStore } from '../../../stores/auth'
import { useNavigate } from 'react-router-dom'

interface IFormFields {
  fullName: string
  emailAddress: string
  password: string
}
type FormFieldKeys = keyof IFormFields

const FormFields: { [key in FormFieldKeys]: key } = {
  fullName: 'fullName',
  emailAddress: 'emailAddress',
  password: 'password',
} as const

export const SignUpForm: FC = () => {
  const formMethods = useForm<IFormFields>()

  const [isSigningUp, setIsSigningUp] = useState(false)

  const setLoginData = useAuthStore((state) => state.setLoginData)
  const navigate = useNavigate()

  const handleSignUp = async ({ fullName, emailAddress, password }: IFormFields) => {
    setIsSigningUp(true)
    const { nextStep } = await signUp({
      username: emailAddress,
      password,
      options: {
        userAttributes: {
          email: emailAddress,
          name: fullName,
        },
      },
    })

    setLoginData({ fullName, emailAddress })

    if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
      navigate('confirm')
    }
    setIsSigningUp(false)
  }

  const onSubmit = (formData: IFormFields) => handleSignUp(formData)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-mt-12">
        <Input
          id={FormFields.fullName}
          register={formMethods.register}
          title="Nome"
          placeholder="Qual o seu nome?"
          className="tw-mt-2"
        />
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
          placeholder="Crie uma senha"
          className="tw-mt-2"
        />
        <Button text="Inscreva-se" type="submit" isLoading={isSigningUp} className="tw-mt-12" />
      </form>
    </FormProvider>
  )
}
