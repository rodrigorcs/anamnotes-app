import { z } from 'zod'
import { regexValidators } from './common'

export const ForgotPasswordFormSchema = z.object({
  emailAddress: z
    .string()
    .min(1, { message: 'Por favor, informe o seu email' })
    .regex(regexValidators.emailAddress, { message: 'O email informado é inválido' }),
})

export type TForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>
type TForgotPasswordFormFieldsKeys = keyof TForgotPasswordFormData
export const ForgotPasswordFormFields: { [key in TForgotPasswordFormFieldsKeys]: key } = {
  emailAddress: 'emailAddress',
} as const
