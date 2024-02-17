import { Request, Response, NextFunction } from 'express'

import CodeAssignmentService from './codeAssignment.service'
import { serialize } from './codeAssignment.serializer'

import { GenericResponse, NotFound, Updated } from '../utils/apiResponse.utils'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const codeAssignment = await CodeAssignmentService.list()

    res.status(200).json(codeAssignment.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const codeAssignment = await CodeAssignmentService.retrieve(id)

    if (!codeAssignment) return res.status(404).json(NotFound)

    const response = serialize(codeAssignment)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) return res.status(400).json(new GenericResponse('Code Assignment requires file upload for grader'))

    const codeAssignment = await CodeAssignmentService.create(req.body, req.file.buffer)
    const response = serialize(codeAssignment)

    res.status(201).json(response)
  } catch (err) {
    res.status(400).json(new GenericResponse(err.message))
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) return res.status(400).json(new GenericResponse('Code Assignment requires file upload for grader'))

    req.body.id = parseInt(req.params.id)
    const results = await CodeAssignmentService.update(req.body, req.file.buffer)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await CodeAssignmentService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, put, _delete }
