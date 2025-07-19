export type User = {
  id: string
  phone: string //!unique
  username?: string //!unique
  email?: string //!unique
  name: string
  password?: string
  accessCode?: string
  role: ERole
  setupToken?: string
  hasSetupCompleted?: boolean
}

export enum ERole {
  INSTRUCTOR = 'instructor',
  STUDENT = 'student'
}

export enum EStudentLessonStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}
