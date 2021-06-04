import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import initialState from './initialState/index'
import rootReducer from './reducers/index'

export const composeEnhancers = window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

function configureStore() {
  const store = createStore(rootReducer, initialState, composeWithDevTools())

  return store
}

export default configureStore()
