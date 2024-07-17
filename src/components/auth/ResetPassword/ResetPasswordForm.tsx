import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { AuthError, confirmResetPassword } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ResetPasswordFormFields,
  ResetPasswordFormSchema,
  TResetPasswordFormData,
} from '../../../models/forms/ResetPasswordForm'
import { useAuthStore } from '../../../stores/auth'
import { Alert } from '../../common/Alert'
import { useFeedback } from '../../../hooks/useFeedback'

export const ResetPasswordForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<TResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
  })

  const resetPasswordData = useAuthStore((state) => state.resetPasswordData)

  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const { feedback, setFeedback, setUnexpectedError } = useFeedback()

  const handleResetPassword = async ({ otp, newPassword }: TResetPasswordFormData) => {
    if (!resetPasswordData) throw new Error('Reset password data not found')
    setIsResettingPassword(true)

    try {
      await confirmResetPassword({
        username: resetPasswordData.emailAddress,
        newPassword,
        confirmationCode: otp,
      })

      navigate('/auth')
    } catch (error) {
      if (error instanceof AuthError) {
        if (['UserNotFoundException', 'CodeMismatchException'].includes(error.name)) {
          setFeedback({
            type: 'error',
            message: 'Código de verificação incorreto.',
          })
          return
        }
      }
      setUnexpectedError()
    } finally {
      setIsResettingPassword(false)
    }
  }

  const onSubmit = (formData: TResetPasswordFormData) => handleResetPassword(formData)

  return (
    <div className="tw-flex tw-flex-col tw-mt-8">
      <Alert feedback={feedback} className="tw-mb-4" />
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col">
          <Input
            id={ResetPasswordFormFields.otp}
            title="Código de verificação"
            placeholder="123456"
            className="tw-mt-2"
            type="text"
            autoComplete="one-time-code"
          />
          <Input
            id={ResetPasswordFormFields.newPassword}
            title="Nova senha"
            placeholder="Crie uma nova senha"
            className="tw-mt-2"
            type="password"
            autoComplete="new-password"
          />
          <Input
            id={ResetPasswordFormFields.confirmPassword}
            title="Confirmar senha"
            placeholder="Confirme a sua nova senha"
            className="tw-mt-2"
            type="password"
            autoComplete="new-password"
          />
          <Button
            text="Enviar"
            type="submit"
            isLoading={isResettingPassword}
            className="tw-mt-12"
          />
        </form>
      </FormProvider>
    </div>
  )
}
