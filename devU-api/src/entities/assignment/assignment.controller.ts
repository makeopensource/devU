import { Request, Response, NextFunction } from 'express'

import AssignmentService from './assignment.service'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './assignment.serializer'

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.assignmentId)
    const courseId = parseInt(req.params.courseId)
    const assignment = await AssignmentService.retrieve(id, courseId)

    if (!assignment) return res.status(404).json(NotFound)

    const response = serialize(assignment)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const assignments = await AssignmentService.listByCourse(courseId)

    const response = assignments.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
export async function getReleased(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const assignments = await AssignmentService.listByCourseReleased(courseId)

    const response = assignments.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await AssignmentService.create(req.body)
    const response = serialize(assignment)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.assignmentId)
    const results = await AssignmentService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.assignmentId)
    const results = await AssignmentService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { detail, post, put, _delete, getByCourse, getReleased }
