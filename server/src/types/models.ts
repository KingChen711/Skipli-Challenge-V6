import { type ERole } from "./enum"

//TODO: check unique fields involve auth
export type User = {
  id: string
  phone: string //!unique
  username: string //!unique
  email?: string //!unique
  password?: string
  accessCode?: string
  role: ERole
}
