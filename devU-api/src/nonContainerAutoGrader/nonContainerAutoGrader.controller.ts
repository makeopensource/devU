import { Request, Response, NextFunction } from 'express'

import { GenericResponse, NotFound, Updated } from '../utils/apiResponse.utils'
import { serialize } from './nonContainerAutoGrader.serializer'
import NonContainerAutoGraderService from './nonContainerAutoGrader.service'


export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = parseInt(req.params.id)

    const nonContainerQuestions = await NonContainerAutoGraderService.list(assignmentId)

    res.status(200).json(nonContainerQuestions.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const nonContainerAutoGrader = await NonContainerAutoGraderService.retrieve(id)

    if (!nonContainerAutoGrader) return res.status(404).json(NotFound)

    const response = serialize(nonContainerAutoGrader)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const nonContainer = await NonContainerAutoGraderService.create(req.body)
    const response = serialize(nonContainer)

    res.status(201).json(response)
  } catch (err) {
    res.status(400).json(new GenericResponse(err.message))
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await NonContainerAutoGraderService.update(req.body)

    if (!result.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await NonContainerAutoGraderService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, put, _delete }
