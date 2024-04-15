import { Request, Response, NextFunction } from 'express'

import RoleService from './role.service'
import { serialize } from './role.serializer'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {

    const userCourses = await RoleService.listAll()

    res.status(200).json(userCourses.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const userCourses = await RoleService.list(id)

    res.status(200).json(userCourses.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function getByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const userCourses = await RoleService.list(id)

    res.status(200).json(userCourses.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const userCourses = await RoleService.listByCourse(id)

    const response = userCourses.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const userCourse = await RoleService.retrieve(id)

    if (!userCourse) return res.status(404).json(NotFound)

    const response = serialize(userCourse)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const userCourse = await RoleService.create(req.body)
    const response = serialize(userCourse)

    res.status(201).json(response)
  } catch (err) {
    res.status(400).json(new GenericResponse(err.message))
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.id)
    const results = await RoleService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await RoleService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, getByCourse, getByUser, getAll, detail, post, put, _delete }
