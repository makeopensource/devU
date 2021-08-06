import { User, Token } from 'devu-shared-modules'

import { UserState } from 'redux/types/user.types'

import RequestService from 'services/request.service'

import { decodeAccessToken } from 'utils/authentication.utils'

/**
 * Function to grab all the data that the application needs to initialize itself
 *
 * Right now that means grabbing yourself an access token as well as the user info for yourself
 */
async function fetchUserInfo(): Promise<UserState> {
  const loginResponse = await RequestService.get<Token>('/api/login', { credentials: 'include' })
  const decodedToken = decodeAccessToken(loginResponse.accessToken)

  // Normally the RequestService will handle all of this for us
  // But because the auth token hasn't been written to the store yet (and the RequestService attempts to get
  // the access token from the store), we have to setup the request by hand
  const options = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${loginResponse.accessToken}`,
    },
  }

  // Telling the request service to not use it's auth (it's not there) and passing by hand via options
  const user = await RequestService.get<User>(`/api/users/${decodedToken.userId}`, options, true)

  return { ...loginResponse, ...user }
}

export default fetchUserInfo
