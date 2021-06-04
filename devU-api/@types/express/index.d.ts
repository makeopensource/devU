import User from '../../src/model/users.model'

declare global {
  namespace Express {
    interface Request {
      user?: User
      users?: User[]
    }
  }
}
