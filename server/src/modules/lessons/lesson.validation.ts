import { z } from "zod"

import { phoneNumberSchema } from "src/helpers/validation"

export const assignLessonSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3),
    description: z.string().trim().min(3),
    studentPhones: z.array(phoneNumberSchema),
  }),
})

export type TAssignLessonSchema = z.infer<typeof assignLessonSchema>
