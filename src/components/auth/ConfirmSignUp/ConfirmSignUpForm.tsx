import { FC, useEffect, useState } from 'react'
import { Input } from '../../common/Input'
import { confirmSignUp } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/auth'

interface IFormFields {
  otp: string
}
type FormFieldKeys = keyof IFormFields

const FormFields: { [key in FormFieldKeys]: key } = {
  otp: 'otp',
} as const

export const ConfirmSignUpForm: FC = () => {
  const navigate = useNavigate()
  const formMethods = useForm<IFormFields>()

  const [isConfirmingSignUp, setIsConfirmingSignUp] = useState(false)

  const loginData = useAuthStore((state) => state.loginData)

  useEffect(() => {
    if (!loginData) navigate('..')
  }, [loginData])

  const handleConfirmSignUp = async ({ otp }: IFormFields) => {
    if (!loginData) throw new Error('Login data not found')
    setIsConfirmingSignUp(true)

    const { isSignUpComplete } = await confirmSignUp({
      username: loginData.emailAddress,
      confirmationCode: otp,
    })

    if (isSignUpComplete) navigate('/auth/sign-in')
    setIsConfirmingSignUp(false)
  }

  const onSubmit = (formData: IFormFields) => handleConfirmSignUp(formData)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-mt-6">
        <Input
          id={FormFields.otp}
          title="Código de verificação"
          register={formMethods.register}
          placeholder="123456"
          className="tw-mt-2"
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
