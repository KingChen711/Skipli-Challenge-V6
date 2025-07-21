import { z } from "zod"

export const sendMessageSchema = z.object({
  body: z.object({
    receiverId: z.string().trim().min(1),
    content: z.string().min(1),
  }),
})

export type TSendMessageSchema = z.infer<typeof sendMessageSchema>

export const getMessagesSchema = z.object({
  params: z.object({
    partnerId: z.string().trim().min(1),
  }),
})

export type TGetMessagesSchema = z.infer<typeof getMessagesSchema>
