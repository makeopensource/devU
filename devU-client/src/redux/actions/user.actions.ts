import { SET_USER, UserState } from 'redux/types/user.types'

export const setUser = (payload: UserState) => ({ type: SET_USER, payload })
