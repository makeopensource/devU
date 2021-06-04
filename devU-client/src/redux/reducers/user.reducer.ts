import { SET_USER, UPDATE_INSTITUTION, UserActionType, UserState } from '../types/user.types'

import initialState from 'redux/initialState/user.initialState'

const reducer = (user = initialState, action: UserActionType): UserState => {
  switch (action.type) {
    case SET_USER:
      return { ...action.payload }

    case UPDATE_INSTITUTION:
      return { ...user, institution: { ...user.institution, ...action.payload } }

    default:
      return user
  }
}

export default reducer
