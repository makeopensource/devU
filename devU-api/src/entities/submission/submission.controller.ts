import { Submission } from 'devu-shared-modules'
import { Request, Response, NextFunction } from 'express'

import SubmissionService from '../submission/submission.service'

import { GenericResponse, NotFound } from '../utils/apiResponse.utils'

import { serialize } from '../submission/submission.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const submissions = await SubmissionService.list()
    const response = submissions.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const submission = await SubmissionService.retrieve(id)

    if (!submission) return res.status(404).json(NotFound)

    const response = serialize(submission)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    // If this is hit, developer messed up above in the chain by not checking the user for auth
    if (!req.currentUser?.userId) return res.status(400).json(new GenericResponse('Request requires auth'))

    const requestBody: Submission = req.body

    requestBody.submitterIp = req.header('x-forwarded-for') || req.socket.remoteAddress
    requestBody.submittedBy = req.currentUser?.userId

    const submission = await SubmissionService.create(requestBody)
    const response = serialize(submission)

    res.status(201).json(response)
  } catch (err) {
    res.status(400).json(new GenericResponse(err.message))
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await SubmissionService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, _delete }
