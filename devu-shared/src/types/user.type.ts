import { ApiAuth } from './auth.types'

export type User = {
  id?: number
  schoolId?: string
  email: string
  createdAt?: string
  updatedAt?: string
  preferredName?: string
}

export type LoginUser = {
  user: User
  auth: ApiAuth
}

export default User
