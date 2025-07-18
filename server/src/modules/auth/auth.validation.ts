import { z } from "zod"

export const createAccessCodeSchema = z.object({
  body: z.object({
    phoneNumber: z.string().trim().min(1),
  }),
})

export type TCreateAccessCodeSchema = z.infer<typeof createAccessCodeSchema>

export const validateAccessCodeSchema = z.object({
  body: z.object({
    phoneNumber: z.string().trim().min(1),
    accessCode: z.coerce.number().int().min(100000).max(999999),
  }),
})

export type TValidateAccessCodeSchema = z.infer<typeof validateAccessCodeSchema>
