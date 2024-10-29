import { Request, Response, NextFunction } from 'express'

import UserService from './user.service'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './user.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await UserService.list()
    const response = users.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const user = await UserService.retrieve(id)

    if (!user) return res.status(404).json(NotFound)

    const response = serialize(user)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
//USE THIS
export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.id)
    const userRole = req.query.role

    const users = await UserService.listByCourse(courseId, userRole as string)
    const response = users.map(u => {
      if (u) return serialize(u)
    })
    // TODO: This should return users, not userRoles
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserService.create(req.body)
    const response = serialize(user)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.id)
    const results = await UserService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await UserService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, put, _delete, getByCourse }
