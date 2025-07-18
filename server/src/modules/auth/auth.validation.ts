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
