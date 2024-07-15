import { FC, useEffect, useState } from 'react'
import { Input } from '../../common/Input'
import { confirmSignUp } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ConfirmSignUpFormFields,
  ConfirmSignUpFormSchema,
  TConfirmSignUpFormData,
} from '../../../models/forms/ConfirmSignUpForm'

export const ConfirmSignUpForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<TConfirmSignUpFormData>({
    resolver: zodResolver(ConfirmSignUpFormSchema),
  })

  const [isConfirmingSignUp, setIsConfirmingSignUp] = useState(false)

  const loginData = useAuthStore((state) => state.loginData)

  useEffect(() => {
    if (!loginData) navigate('..')
  }, [loginData])

  const handleConfirmSignUp = async ({ otp }: TConfirmSignUpFormData) => {
    if (!loginData) throw new Error('Login data not found')
    setIsConfirmingSignUp(true)

    const { isSignUpComplete } = await confirmSignUp({
      username: loginData.emailAddress,
      confirmationCode: otp,
    })

    if (isSignUpComplete) navigate('/auth/sign-in')
    setIsConfirmingSignUp(false)
  }

  const onSubmit = (formData: TConfirmSignUpFormData) => handleConfirmSignUp(formData)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-mt-6">
        <Input
          id={ConfirmSignUpFormFields.otp}
          title="Código de verificação"
          placeholder="123456"
          className="tw-mt-2"
          type="text"
          autoComplete="one-time-code"
        />
        <Button
          text="Confirmar"
          type="submit"
          isLoading={isConfirmingSignUp}
          className="tw-mt-12"
        />
      </form>
    </FormProvider>
  )
}
