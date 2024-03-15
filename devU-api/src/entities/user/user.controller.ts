import { Request, Response, NextFunction } from 'express'

import UserService from './user.service'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { UserCourseLevel } from 'devu-shared-modules'

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

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.id)
    const userLevel = req.query.level as UserCourseLevel | undefined

    const users = await UserService.listByCourse(courseId, userLevel)
    const response = users.map(u => { if (u) return serialize(u) })

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
    res.status(400).json(new GenericResponse(err.message))
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
