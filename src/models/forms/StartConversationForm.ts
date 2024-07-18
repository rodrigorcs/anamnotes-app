import { z } from 'zod'

export const StartConversationFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Por favor, informe o nome do paciente' }),
})

export type TStartConversationFormData = z.infer<typeof StartConversationFormSchema>
type TStartConversationFormFieldsKeys = keyof TStartConversationFormData
export const StartConversationFormFields: { [key in TStartConversationFormFieldsKeys]: key } = {
  fullName: 'fullName',
} as const
