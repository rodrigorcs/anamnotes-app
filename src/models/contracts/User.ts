import { z } from 'zod'

const AuthenticatedUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  emailAddress: z.string(),
  isEmailVerified: z.boolean(),
})

export type TAuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>

export const parseAuthenticatedUser = (data: unknown) => {
  return AuthenticatedUserSchema.parse(data)
}
