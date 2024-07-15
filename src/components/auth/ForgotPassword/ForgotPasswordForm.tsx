import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { resetPassword } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ForgotPasswordFormFields,
  ForgotPasswordFormSchema,
  TForgotPasswordFormData,
} from '../../../models/forms/ForgotPasswordForm'
import { useAuthStore } from '../../../stores/auth'

export const ForgotPasswordForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<TForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  })
  const setResetPasswordData = useAuthStore((state) => state.setResetPasswordData)

  const [isSendingOTP, setIsSendingOTP] = useState(false)

  const handleSendOTP = async ({ emailAddress }: TForgotPasswordFormData) => {
    setIsSendingOTP(true)
    const { nextStep } = await resetPassword({
      username: emailAddress,
    })

    if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
      setResetPasswordData({ emailAddress })
      navigate('reset')
    }
    setIsSendingOTP(false)
  }

  const onSubmit = (formData: TForgotPasswordFormData) => handleSendOTP(formData)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-mt-12">
        <Input
          id={ForgotPasswordFormFields.emailAddress}
          title="E-mail"
          placeholder="exemplo@email.com"
          className="tw-mt-2"
          type="email"
          autoComplete="email"
        />
        <Button text="Enviar" type="submit" isLoading={isSendingOTP} className="tw-mt-12" />
      </form>
    </FormProvider>
  )
}
