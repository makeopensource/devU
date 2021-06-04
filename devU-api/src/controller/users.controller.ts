import { Request, Response, NextFunction } from 'express'

import UserService from '../services/user.service'

import { NotFound, Updated } from '../utils/apiResponse.utils'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    req.users = await UserService.list()
    req.statusCode = 200

    next()
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const user = await UserService.retrieve(id)

    if (!user) return res.status(404).json(NotFound)

    req.user = user
    req.statusCode = 200

    next()
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    req.user = await UserService.create(req.body)
    req.statusCode = 201

    next()
  } catch (err) {
    res.status(400).json({ error: err })
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

export default { get, detail, post, put, _delete }
