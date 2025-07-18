import { type ERole, type EStudentLessonStatus } from "./enum"

//TODO: check unique fields involve auth
export type User = {
  id: string
  phone: string //!unique
  username?: string //!unique
  email?: string //!unique
  name: string
  password?: string
  accessCode?: string
  role: ERole
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
