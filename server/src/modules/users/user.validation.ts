import { z } from "zod"

import { phoneNumberSchema } from "src/helpers/validation"

//TODO: add filter fields
export const getStudentsSchema = z.object({
  query: z.object({
    pageNumber: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
  }),
})

export type TGetStudentsSchema = z.infer<typeof getStudentsSchema>

export const getStudentSchema = z.object({
  params: z.object({
    phone: phoneNumberSchema,
  }),
})

export type TGetStudentSchema = z.infer<typeof getStudentSchema>

export const addStudentSchema = z.object({
  body: z.object({
    phone: phoneNumberSchema,
    name: z.string().trim().min(3),
    email: z.string().trim().email().min(1),
  }),
})

export type TAddStudentSchema = z.infer<typeof addStudentSchema>

//TODO: check valid fields for edit
export const editStudentSchema = z.object({
  params: z.object({
    phone: phoneNumberSchema,
  }),
  body: z.object({
    // username is using for login, so it is not allowed for instructor to be changed
    // email is using for login, so it is not allowed for instructor to be changed
    // phone is using for login, so it is not allowed for instructor to be changed
    name: z.string().trim().min(3),
  }),
})

export type TEditStudentSchema = z.infer<typeof editStudentSchema>

export const deleteStudentSchema = z.object({
  params: z.object({
    phone: phoneNumberSchema,
  }),
})

export type TDeleteStudentSchema = z.infer<typeof deleteStudentSchema>
