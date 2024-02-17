import { Request, Response, NextFunction } from 'express'

import AssignmentScoreService from './assignmentScore.service'

import { GenericResponse, NotFound, Updated } from '../utils/apiResponse.utils'

import { serialize } from './assignmentScore.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const assignmentScores = await AssignmentScoreService.list()
        const response = assignmentScores.map(serialize)

        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id)
        const assignmentScore = await AssignmentScoreService.retrieve(id)

        if (!assignmentScore) return res.status(404).json(NotFound)

        const response = serialize(assignmentScore)

        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

export async function post(req: Request, res: Response, next: NextFunction) {
    try {
        const assignmentScore = await AssignmentScoreService.create(req.body)
        const response = serialize(assignmentScore)

        res.status(201).json(response)
    } catch (err) {
        next(err)
    }
}

export async function put(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.id = parseInt(req.params.id) 
        const results = await AssignmentScoreService.update(req.body)

        if (!results.affected) return res.status(404).json(NotFound)

        res.status(200).json(Updated)
    } catch (err) {
        next(err)
    }
}
export async function _delete(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id) 
        const results = await AssignmentScoreService._delete(id)

        if (!results.affected) return res.status(404).json(NotFound)

        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export default { get, detail, post, put, _delete }