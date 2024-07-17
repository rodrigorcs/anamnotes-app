import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { AuthError, resetPassword } from 'aws-amplify/auth'
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
import { useFeedback } from '../../../hooks/useFeedback'
import { Alert } from '../../common/Alert'

export const ForgotPasswordForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<TForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  })
  const setResetPasswordData = useAuthStore((state) => state.setResetPasswordData)

  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const { feedback, setUnexpectedError } = useFeedback()

  const goToResetPasswordPage = (emailAddress: string) => {
    setResetPasswordData({ emailAddress })
    navigate('reset')
  }

  const handleSendOTP = async ({ emailAddress }: TForgotPasswordFormData) => {
    setIsSendingOTP(true)
    try {
      const { nextStep } = await resetPassword({
        username: emailAddress,
      })

      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        goToResetPasswordPage(emailAddress)
      }
    } catch (error) {
      if (error instanceof AuthError && error.name === 'UserNotFoundException') {
        goToResetPasswordPage(emailAddress)
        return
      }
      setUnexpectedError()
    } finally {
      setIsSendingOTP(false)
    }
  }

  const onSubmit = (formData: TForgotPasswordFormData) => handleSendOTP(formData)

  return (
    <div className="tw-flex tw-flex-col tw-mt-8">
      <Alert feedback={feedback} className="tw-mb-4" />
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col">
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
    </div>
  )
}
