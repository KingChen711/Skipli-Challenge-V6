import { type ERole, type EStudentLessonStatus } from "./enum"

export type User = {
  id: string
  phone: string
  username?: string
  email?: string
  name: string
  password?: string
  accessCode?: string
  role: ERole
  setupToken?: string
  hasSetupCompleted?: boolean
}

export type Lesson = {
  id: string
  title: string
  description: string
}

export type StudentLesson = {
  studentId: string
  lessonId: string
  status: EStudentLessonStatus
}

export type Message = {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: Date | string
  conversationIds: string[]
}

export type Conversation = {
  id: string
  yourId: string
  partnerId: string
  lastMessage: Message
}
