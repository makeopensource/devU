import { Request, Response, NextFunction } from 'express'

import User from '../../model/users.model'
import UserType from '../../shared/types/user.type'

import { Unknown } from '../../utils/apiResponse.utils'

export default function (req: Request, res: Response, next: NextFunction) {
  // No data applied at the controller level
  if (!req.user && !req.users) return res.status(400).json(Unknown)

  const response = req.user ? serialize(req.user) : req.users.map(serialize)

  res.status(req.statusCode).json(response)
}

function serialize(user: User): UserType {
  return {
    id: user.id,
    schoolId: user.schoolId,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    preferredName: user.preferredName,
  }
}
