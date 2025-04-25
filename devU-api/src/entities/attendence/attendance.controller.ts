import { NextFunction, Request, Response } from 'express'

import { GenericResponse, NotFound } from '../../utils/apiResponse.utils'

import AttendanceService from './attendance.service'
import { AttendanceRequest } from 'devu-shared-modules'
import { serialize } from './attendance.serializer'
import AttendanceSubmissionService from './attendanceSubmission.service'
import { serialize as submissionSerialize } from './attendanceSubmission.serializer'

export async function getSessionById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json(new GenericResponse('Invalid ID parameter.'))
    }

    const session = await AttendanceService.getSessionById(id)

    if (!session) {
      return res.status(404).json(NotFound)
    }

    res.status(200).json(serialize(session))
  } catch (err) {
    next(err)
  }
}


export async function getAllSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)

    const session = await AttendanceService.getSessionById(id)
    if (!session) {
      return res.status(404).json(NotFound)
    }

    const submissions = await AttendanceSubmissionService.getAllSubmissionsSessionId(session.id)
    res.status(200).json(submissions.map(submissionSerialize))
  } catch (err) {
    next(err)
  }
}

export async function getSessionsByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    if (isNaN(courseId)) {
      return res.status(400).json(new GenericResponse('Invalid course ID parameter.'))
    }

    const sessions = await AttendanceService.getSessionsByCourse(courseId)

    res.status(200).json(sessions.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionInput = <AttendanceRequest>{
      timeLimitSeconds: req.body.timeLimitSeconds!,
      maxTries: req.body.maxTries!,
      courseId: parseInt(req.params.courseId),
    }
    const createdByUserId = req.currentUser!.userId! as number

    const newSessionResponse = await AttendanceService.create(sessionInput, createdByUserId)

    res.status(201).json(newSessionResponse)
  } catch (err) {
    next(err)
  }
}

export async function submitAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = parseInt(req.params.sessionId)
    const { attendanceCode } = req.body

    const studentUserId = req.currentUser!.userId! as number

    const submissionResult = await AttendanceService.submitCode(sessionId, studentUserId, attendanceCode)

    res.status(200).json(submissionResult)
  } catch (err) {
    next(err)
  }
}


export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await AttendanceService.deleteSession(id)

    if (!results.affected || results.affected === 0) {
      return res.status(404).json(NotFound)
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default {
  getSessionById,
  getSessionsByCourse,
  createSession,
  submitAttendance,
  deleteSession,
  getAllSubmissions
}