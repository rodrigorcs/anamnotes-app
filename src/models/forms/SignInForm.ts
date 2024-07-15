import { z } from 'zod'
import { regexValidators } from './common'

export const SignInFormSchema = z.object({
  emailAddress: z
    .string()
    .min(1, { message: 'Por favor, informe o seu email' })
    .regex(regexValidators.emailAddress, { message: 'O email informado é inválido' }),
  password: z.string().min(1, { message: 'Por favor, informe uma senha' }),
})

export type TSignInFormData = z.infer<typeof SignInFormSchema>
type TSignInFormFieldsKeys = keyof TSignInFormData
export const SignInFormFields: { [key in TSignInFormFieldsKeys]: key } = {
  emailAddress: 'emailAddress',
  password: 'password',
} as const
