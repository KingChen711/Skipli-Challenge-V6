import validator from "validator"
import { z } from "zod"

export const phoneNumberSchema =
  process.env.NODE_ENV === "production"
    ? z.string().trim().refine(validator.isMobilePhone, {
        message: "Invalid phone number",
      })
    : z.string().trim().min(1)
