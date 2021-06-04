import { UserState, Institution, SET_USER, UPDATE_INSTITUTION } from 'redux/types/user.types'

export const setUser = (user: UserState) => ({
  type: SET_USER,
  payload: user,
})

export const updateInstitution = (institution: Institution) => ({
  type: UPDATE_INSTITUTION,
  payload: institution,
})
