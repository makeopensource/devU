import { Token, AccessToken } from 'devu-shared-modules'

import RequestService from 'services/request.service'

import store from 'redux/store'
import { RootState } from 'redux/reducers'
import { SET_USER } from 'redux/types/user.types'

export function decodeAccessToken(accessToken: string): AccessToken {
  const base64Url = accessToken.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )

  return JSON.parse(jsonPayload)
}

function timeInSecondsToEpoch(): number {
  return Math.round(Date.now() / 1000)
}

function setToken({ accessToken }: Token) {
  const state: RootState = store.getState()
  const payload = { ...state.user, accessToken }

  store.dispatch({ type: SET_USER, payload: payload })

  return accessToken
}

/**
 * Gets your accessToken from the state
 * Using this function ensures that your accessToken is always up to date
 * (aka it refreshes it for you if it's expired or nearing expiration)
 */
export function getToken(): Promise<string> | string {
  const state: RootState = store.getState()
  const { accessToken } = state.user

  if (!accessToken) return ''

  const decodedToken = decodeAccessToken(accessToken)
  const expirationCutoff = timeInSecondsToEpoch() - 60 // within 60 seconds of expiration

  if (decodedToken.exp && decodedToken.exp < expirationCutoff) return accessToken

  return RequestService.get('/api/login', { credentials: 'include' })
    .then(setToken)
    .catch(() => {
      // If for whatever reason the user can't be reauthenticated
      // Refresh to restart the auth flow
      window.location.reload

      return '' // to make sure the function always returns a string
    })
}
