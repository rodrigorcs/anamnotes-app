import { FC } from 'react'
import { Input } from '../../common/Input'
import { confirmSignUp } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../common/Button'
import { useAuthStore } from '../../../stores/auth'
import { useNavigate } from 'react-router-dom'

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
  const emailAddress = useAuthStore((state) => state.emailAddress)

  const handleConfirmSignUp = async ({ otp }: IFormFields) => {
    if (!emailAddress) throw new Error('Email address is required')

    const { isSignUpComplete } = await confirmSignUp({
      username: emailAddress,
      confirmationCode: otp,
    })

    if (isSignUpComplete) navigate('/sign-in')
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
        <Button text="Confirmar" type="submit" className="tw-mt-12" />
      </form>
    </FormProvider>
  )
}
