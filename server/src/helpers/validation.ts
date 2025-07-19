import validator from "validator"
import { z } from "zod"

export const phoneNumberSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, {
    message: "Invalid phone number",
  })

export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username must be less than 20 characters" })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username must contain only letters, numbers",
  })
