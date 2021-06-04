import { combineReducers } from 'redux'

import user from './user.reducer'

const reducers = combineReducers({
  user,
})

export type RootState = ReturnType<typeof reducers>
export default reducers
