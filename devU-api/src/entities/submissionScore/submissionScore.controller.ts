import { Request, Response, NextFunction } from 'express'
import submissionScoreService from './submissionScore.service'

import SubmissionScoreService from './submissionScore.service' //why is this twice im not even gonna touch it lmao 

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './submissionScore.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const submissionScores = await SubmissionScoreService.list()
    const response = submissionScores.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const submissionScore = await submissionScoreService.retrieve(id)

    if (!submissionScore) return res.status(404).json(NotFound)

    const response = serialize(submissionScore)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const submissionScore = await SubmissionScoreService.create(req.body)
    const response = serialize(submissionScore)

    res.status(201).json(response)
  } catch (err) {
    res.status(400).json(new GenericResponse(err.message))
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.id)
    const results = await SubmissionScoreService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await SubmissionScoreService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, put, _delete }
