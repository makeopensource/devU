import { SET_USER, UPDATE_USER, UserActionType, UserState } from 'redux/types/user.types'

import initialState from 'redux/initialState/user.initialState'

const reducer = (user = initialState, action: UserActionType): UserState => {
  switch (action.type) {
    case SET_USER:
      return { ...action.payload }

    case UPDATE_USER:
      return { ...user, ...action.payload }

    default:
      return user
  }
}

export default reducer
