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
  query: z.object({
    pageNumber: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
  }),
})

export type TGetMessagesSchema = z.infer<typeof getMessagesSchema>

export const getConversationsSchema = z.object({
  query: z.object({
    pageNumber: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
  }),
})

export type TGetConversationsSchema = z.infer<typeof getConversationsSchema>
