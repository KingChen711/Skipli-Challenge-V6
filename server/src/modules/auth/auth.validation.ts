import { z } from "zod"

import { phoneNumberSchema, usernameSchema } from "../../helpers/validation"

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
    username: usernameSchema,
    password: z.string().trim().min(6),
  }),
})

export type TCompleteSetupSchema = z.infer<typeof completeSetupSchema>

export const checkExistAccountSchema = z.object({
  body: z
    .object({
      type: z.enum(["email", "phone", "username"]),
      identifier: z.string().trim().min(3),
    })
    .refine(
      (data) => {
        if (data.type !== "email") return true
        return z
          .string()
          .email()
          .trim()
          .toLowerCase()
          .safeParse(data.identifier).success
      },
      {
        path: ["identifier"],
        message: "Invalid email",
      }
    )
    .refine(
      (data) => {
        if (data.type !== "phone") return true
        return phoneNumberSchema.safeParse(data.identifier).success
      },
      {
        path: ["identifier"],
        message: "Invalid phone",
      }
    )
    .transform((data) => {
      if (data.type !== "username") return data
      return { ...data, identifier: data.identifier.toLowerCase() }
    }),
})

export type TCheckExistAccountSchema = z.infer<typeof checkExistAccountSchema>

export const authenticateSchema = z.object({
  body: z
    .object({
      type: z.enum(["email", "phone", "username"]),
      identifier: z.string().trim().min(3),
      authType: z.enum(["password", "sms", "code"]),
      authValue: z.string().trim().min(1),
    })
    .refine(
      (data) => {
        if (data.type !== "email") return true
        return z
          .string()
          .email()
          .trim()
          .toLowerCase()
          .safeParse(data.identifier).success
      },
      {
        path: ["identifier"],
        message: "Invalid email",
      }
    )
    .refine(
      (data) => {
        if (data.type !== "phone") return true
        return phoneNumberSchema.safeParse(data.identifier).success
      },
      {
        path: ["identifier"],
        message: "Invalid phone",
      }
    )
    .transform((data) => {
      if (data.type !== "username") return data
      return { ...data, identifier: data.identifier.toLowerCase() }
    }),
})

export type TAuthenticateSchema = z.infer<typeof authenticateSchema>
