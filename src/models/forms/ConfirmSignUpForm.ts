import { z } from 'zod'

export const ConfirmSignUpFormSchema = z.object({
  otp: z
    .string()
    .min(1, { message: 'Por favor, informe o código enviado para o seu email' })
    .length(6, { message: 'O código deve conter 6 dígitos' }),
})

export type TConfirmSignUpFormData = z.infer<typeof ConfirmSignUpFormSchema>
type TConfirmSignUpFormFieldsKeys = keyof TConfirmSignUpFormData
export const ConfirmSignUpFormFields: { [key in TConfirmSignUpFormFieldsKeys]: key } = {
  otp: 'otp',
} as const
