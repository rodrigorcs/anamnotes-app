import { z } from 'zod'
import { regexValidators } from './common'

export const SignUpFormSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Por favor, informe o seu nome completo' })
    .regex(regexValidators.fullName, {
      message: 'O nome informado é inválido, informe o seu nome completo.',
    }),
  emailAddress: z
    .string()
    .min(1, { message: 'Por favor, informe o seu email' })
    .regex(regexValidators.emailAddress, { message: 'O email informado é inválido' }),
  password: z
    .string()
    .min(1, { message: 'Por favor, informe uma senha' })
    .min(8, { message: 'A senha deve conter no mínimo 8 caracteres' })
    .regex(regexValidators.password, {
      message: 'A senha deve conter caracteres maiúsculos, minúsculos, números e símbolos',
    }),
})

export type TSignUpFormData = z.infer<typeof SignUpFormSchema>
type TSignUpFormFieldsKeys = keyof TSignUpFormData
export const SignUpFormFields: { [key in TSignUpFormFieldsKeys]: key } = {
  fullName: 'fullName',
  emailAddress: 'emailAddress',
  password: 'password',
} as const
