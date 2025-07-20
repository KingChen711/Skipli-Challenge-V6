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

export enum ERole {
  INSTRUCTOR = 'instructor',
  STUDENT = 'student'
}

export enum EStudentLessonStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}
