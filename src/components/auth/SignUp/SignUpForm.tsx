import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { signUp } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useAuthStore } from '../../../stores/auth'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SignUpFormFields,
  SignUpFormSchema,
  TSignUpFormData,
} from '../../../models/forms/SignUpForm'

export const SignUpForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<TSignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
  })

  const [isSigningUp, setIsSigningUp] = useState(false)

  const setLoginData = useAuthStore((state) => state.setLoginData)

  const handleSignUp = async ({ fullName, emailAddress, password }: TSignUpFormData) => {
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

  const onSubmit = (formData: TSignUpFormData) => handleSignUp(formData)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-mt-12">
        <Input
          id={SignUpFormFields.fullName}
          title="Nome"
          placeholder="Qual o seu nome completo?"
          className="tw-mt-2"
          type="text"
          autoComplete="name"
        />
        <Input
          id={SignUpFormFields.emailAddress}
          title="E-mail"
          placeholder="exemplo@email.com"
          className="tw-mt-2"
          type="email"
          autoComplete="email"
        />
        <Input
          id={SignUpFormFields.password}
          title="Senha"
          hint="Deve conter no mínimo 8 caracteres, incluindo maiúsculos, minúsculos, números e símbolos."
          placeholder="Crie uma senha"
          className="tw-mt-2"
          type="password"
          autoComplete="new-password"
        />
        <Button text="Inscreva-se" type="submit" isLoading={isSigningUp} className="tw-mt-12" />
      </form>
    </FormProvider>
  )
}
