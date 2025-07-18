import { type ERole } from "./enum"

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

  //studentsPhone is changeable, it not reliable to save in lesson
  //So we need to get student ids from phone numbers
  //Not need to save student ids in another collection for n-n relationship,
  //because firestore is NoSQL and each lesson do not have too many students
  studentIds: string[]
}
