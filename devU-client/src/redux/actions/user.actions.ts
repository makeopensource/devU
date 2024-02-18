import * as T from 'redux/types/user.types'

export const setUser = (payload: T.UserState): T.SetUser => ({ type: T.SET_USER, payload })
