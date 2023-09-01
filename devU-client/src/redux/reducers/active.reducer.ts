import * as ActiveTypes from 'redux/types/active.types'

import initialState from 'redux/initialState/active.initialState'

const reducer = (active = initialState, action: ActiveTypes.ActiveActionType): ActiveTypes.ActiveState => {
  switch (action.type) {
    case ActiveTypes.SET_ALERT:
      return { ...active, alert: action.payload }

    default:
      return active
  }
}

export default reducer
