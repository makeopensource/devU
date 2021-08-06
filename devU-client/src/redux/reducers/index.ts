import { combineReducers } from 'redux'

import active from './active.reducer'
import user from './user.reducer'

const reducers = combineReducers({
  active,
  user,
})

export default reducers
