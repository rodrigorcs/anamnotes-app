import { z } from 'zod'
import { regexValidators } from './common'

export const ResetPasswordFormSchema = z
  .object({
    otp: z
      .string()
      .min(1, { message: 'Por favor, informe o código enviado para o seu email' })
      .length(6, { message: 'O código deve conter 6 dígitos' }),
    newPassword: z
      .string()
      .min(1, { message: 'Por favor, informe uma senha' })
      .min(8, { message: 'A senha deve conter no mínimo 8 caracteres' })
      .regex(regexValidators.password, {
        message: 'A senha deve conter caracteres maiúsculos, minúsculos, números e símbolos',
      }),
    confirmPassword: z.string().min(1, { message: 'Por favor, confirme a sua senha' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas informadas não são iguais',
    path: ['confirmPassword'],
  })

export type TResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>
type TResetPasswordFormFieldsKeys = keyof TResetPasswordFormData
export const ResetPasswordFormFields: { [key in TResetPasswordFormFieldsKeys]: key } = {
  otp: 'otp',
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
} as const
