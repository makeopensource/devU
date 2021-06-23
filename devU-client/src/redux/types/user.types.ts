import { User, Token } from 'devu-shared-modules'

export type UserState = User & Token

export const SET_USER = 'SET_USER'

interface SetUser {
  type: typeof SET_USER
  payload: UserState
}

export type UserActionType = SetUser
