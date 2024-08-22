import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { AuthError, signUp } from 'aws-amplify/auth'
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
import { Alert } from '../../common/Alert'
import { useFeedback } from '../../../hooks/useFeedback'

export const SignUpForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<TSignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
  })

  const [isSigningUp, setIsSigningUp] = useState(false)
  const { feedback, setFeedback, setUnexpectedError } = useFeedback()

  const setLoginData = useAuthStore((state) => state.setLoginData)

  const handleSignUp = async ({ fullName, emailAddress, password }: TSignUpFormData) => {
    setIsSigningUp(true)
    try {
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
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.name === 'UsernameExistsException') {
          setFeedback({
            type: 'error',
            title: 'Usuário já existe',
            message: 'Já existe um usuário com este email, é você? Faça login.',
          })
          return
        }
      }
      setUnexpectedError()
    } finally {
      setIsSigningUp(false)
    }
  }

  const onSubmit = (formData: TSignUpFormData) => handleSignUp(formData)

  return (
    <div className="tw-flex tw-flex-col">
      <Alert feedback={feedback} className="tw-mb-4" />
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col">
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
    </div>
  )
}
