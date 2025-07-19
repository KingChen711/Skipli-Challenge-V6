import { z } from "zod"

import { phoneNumberSchema } from "src/helpers/validation"

export const createAccessCodeSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
  }),
})

export type TCreateAccessCodeSchema = z.infer<typeof createAccessCodeSchema>

export const validateAccessCodeSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
    accessCode: z.coerce.number().int().min(100000).max(999999),
  }),
})

export type TValidateAccessCodeSchema = z.infer<typeof validateAccessCodeSchema>

export const verifySetupTokenSchema = z.object({
  params: z.object({
    token: z.string().trim().min(1),
  }),
})

export type TVerifySetupTokenSchema = z.infer<typeof verifySetupTokenSchema>

export const completeSetupSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1),
    username: z.string().trim().toLowerCase().min(3),
    password: z.string().trim().min(6),
  }),
})

export type TCompleteSetupSchema = z.infer<typeof completeSetupSchema>

// export const checkExistAccountSchema = z.object({
//   body: z.object({
//     token: z.string().trim().min(1),
//     username: z.string().trim().toLowerCase().min(3),
//     password: z.string().trim().min(6),
//   }),
// })

// export type TCheckExistAccountSchema = z.infer<typeof checkExistAccountSchema>
