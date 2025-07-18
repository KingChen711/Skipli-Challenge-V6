import { z } from "zod"

export const createAccessCodeSchema = z.object({
  body: z.object({
    phoneNumber: z.string().trim().min(1),
  }),
})

export type TCreateAccessCodeSchema = z.infer<typeof createAccessCodeSchema>
