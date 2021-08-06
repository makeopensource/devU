export type Alert = {
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  autoDelete: boolean
}

export type ActiveState = {
  alert: Alert | null
}

export const SET_ALERT = 'SET_ALERT'

export interface SetAlert {
  type: typeof SET_ALERT
  payload: Alert | null
}

export type ActiveActionType = SetAlert
