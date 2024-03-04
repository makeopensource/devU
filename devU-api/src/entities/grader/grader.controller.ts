import { Request, Response, NextFunction } from 'express'

import GraderService from './grader.service'

import { GenericResponse, NotFound } from '../../utils/apiResponse.utils'

import { serialize } from '../grader/grader.serializer'

export async function grade(req: Request, res: Response, next: NextFunction) {
    try {
        const submissionId = parseInt(req.params.id)
        const grade = await GraderService.grade(submissionId)
        if (!grade || grade.length === 0) return res.status(404).json(NotFound)

        const response = serialize(grade)

        res.status(200).json(response)
    } catch (err) {
        res.status(400).json(new GenericResponse(err.message))
    }
}

export default { grade }
