export interface Institution {
  id: string
  name: string
  profileImage: string
  colors: string[]
  lastUpdated: string
}

export interface Meta {
  dateCreated: string
}

export interface Feature {
  id: number
  type: string
  institutionId?: number
  settings?: string
  updatedAt?: string
}

export interface UserState {
  firstName: string
  lastName: string
  email: string
  institution: Institution
  meta: Meta
  role: string
  systemUser: boolean
  features: Feature[]
  accountId: string
  externalId: string
}

export const SET_USER = 'SET_USER'
export const UPDATE_INSTITUTION = 'UPDATE_INSTITUTION'

interface SetUser {
  type: typeof SET_USER
  payload: UserState
}
interface UpdateInstitution {
  type: typeof UPDATE_INSTITUTION
  payload: Institution
}

export type UserActionType = SetUser | UpdateInstitution
