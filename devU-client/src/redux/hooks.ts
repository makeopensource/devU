import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { RootState, AppDispatch } from './store'
import ActionTypes from './types'

type ActionFunction = (...args: any[]) => ActionTypes

/**
 * Allows you to setup action function as react hook
 *
 * @param action
 * @returns
 */
export const useAction = <T extends ActionFunction>(action: ActionFunction) => {
  type Arguments = Parameters<T>
  const dispatch = useDispatch<AppDispatch>()

  return (...params: Arguments) => dispatch(action(...params))
}

/**
 * Calls redux dispatch without action
 *
 * @param type - Any action type
 * @returns - dispatch hook () => void
 */
export const useAppDispatch = <T extends ActionTypes['type']>(type: T) => {
  // Get the spcific action type and get the type of that action type's payload
  type Action = Extract<ActionTypes, { type: T }>
  type Payload = Action['payload']

  const dispatch = useDispatch<AppDispatch>()

  // @ts-expect-error
  return (payload: Payload) => dispatch({ type, payload })
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
