import { AccessToken, RefreshToken } from 'devu-shared-modules'
declare global {
  namespace Express {
    interface Request {
      // Auth Data
      currentUser?: AccessToken // Deserialized access token
      refreshUser?: RefreshToken // Deserialized refresh token
    }
  }
}
