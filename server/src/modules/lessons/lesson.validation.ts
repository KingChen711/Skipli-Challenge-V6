import { z } from "zod"

import { phoneNumberSchema } from "../../helpers/validation"

export const assignLessonSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3),
    description: z.string().trim().min(3),
    studentPhones: z.array(phoneNumberSchema),
  }),
})

export type TAssignLessonSchema = z.infer<typeof assignLessonSchema>

export const getMyLessonsSchema = z.object({
  query: z.object({
    pageNumber: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
  }),
})

export type TGetMyLessonsSchema = z.infer<typeof getMyLessonsSchema>

export const getStudentLessonsSchema = z.object({
  params: z.object({
    phone: phoneNumberSchema,
  }),
  query: z.object({
    pageNumber: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
  }),
})

export type TGetStudentLessonsSchema = z.infer<typeof getStudentLessonsSchema>

export const markLessonDoneSchema = z.object({
  body: z.object({
    lessonId: z.string().trim().min(1),
  }),
})

export type TMarkLessonDoneSchema = z.infer<typeof markLessonDoneSchema>

export const getLessonsSchema = z.object({
  query: z.object({
    pageNumber: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
  }),
})

export type TGetLessonsSchema = z.infer<typeof getLessonsSchema>

export const getLessonStudentsSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({
    pageNumber: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
  }),
})

export type TGetLessonStudentsSchema = z.infer<typeof getLessonStudentsSchema>
