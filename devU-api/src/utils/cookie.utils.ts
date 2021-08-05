import { CookieOptions } from 'express'

import environment from '../environment'

export const refreshToken = 'refreshToken'

export const refreshCookieOptions: CookieOptions = {
  maxAge: environment.refreshTokenValiditySeconds * 1000,
  httpOnly: true,
  // Secure doesn't work in some browsers without a cert (localhost)
  // So we disable the secure cookie when dev auth is enabled
  secure: !environment.providers.devAuth.enabled,
  sameSite: true,
}
