import { IsNull } from 'typeorm'
import AttendanceSessionModel from './attendance.model'
import { dataSource } from '../../database'
import { AttendanceRequest, AttendanceResponse } from 'devu-shared-modules'
import attendanceSubmissionService from './attendanceSubmission.service'

const connect = () => dataSource.getRepository(AttendanceSessionModel)

/**
 * Retrieves a specific, non-deleted attendance session by its ID.
 * @param id - The ID of the attendance session.
 * @returns The found attendance session model object, or null if not found.
 */
export async function getSessionById(id: number): Promise<AttendanceSessionModel | null> {
  return await connect().findOne({
    where: { id: id, deletedAt: IsNull() },
  })
}

/**
 * Retrieves all non-deleted attendance sessions for a specific course.
 * @param courseId - The ID of the course.
 * @returns An array of attendance session model objects.
 */
export async function getSessionsByCourse(courseId: number): Promise<AttendanceSessionModel[]> {
  return await connect().find({
    where: {
      courseId: courseId,
      deletedAt: IsNull(),
    },
    order: {
      createdAt: 'DESC', // Show newest sessions first
    },
  })
}


/**
 * Creates a new attendance session.
 * @param sessionInput - Data for creating the session (courseId, createdByUserId, timeLimitSeconds, maxTries).
 * @param createdByUserId
 * @returns The created attendance session object, including the generated code.
 */
export async function create(sessionInput: AttendanceRequest, createdByUserId: number): Promise<AttendanceResponse> {
  const { courseId, timeLimitSeconds, maxTries } = sessionInput

  const attendanceCode = generateAttendanceCode() // Generate the unique code
  const expiresAt = new Date(Date.now() + timeLimitSeconds * 1000) // Calculate expiration

  const newSessionData = <AttendanceSessionModel>{
    courseId,
    createdByUserId,
    attendanceCode,
    timeLimitSeconds,
    maxTries,
    expiresAt,
  }

  const newSession = await connect().save(newSessionData)
  return <AttendanceResponse>{
    id: newSession.id,
    courseId: newSession.courseId,
    maxTries: newSession.maxTries,
    createdAt: newSession.createdAt.toISOString(),
    attendanceCode: newSession.attendanceCode,
    createdByUserId: newSession.createdByUserId,
    timeLimitSeconds: newSession.timeLimitSeconds,
    expiresAt: newSession.expiresAt.toISOString(),
  }
}


/**
 * Handles a student submitting an attendance code.
 * NOTE: This is a simplified version. Full implementation requires tracking individual submissions.
 * @param attendanceSessionId - The ID of the attendance session.
 * @param studentUserId - The ID of the student submitting the code.
 * @param attendanceCode - Contains the submitted attendanceCode.
 * @returns An object indicating if the code was correct and (placeholder) tries left.
 */
export async function submitCode(
  attendanceSessionId: number,
  studentUserId: number,
  attendanceCode: string,
): Promise<{ isCorrect: boolean, triesLeft: number }> {
  const { submission, triesLeft } = await attendanceSubmissionService.create({
    attendanceSessionId,
    submissionCode: attendanceCode,
    submissionUserId: studentUserId,
  })

  return {
    isCorrect: submission.isSuccessful,
    triesLeft: triesLeft,
  }
}


/**
 * Soft deletes an attendance session.
 * @param id - The ID of the attendance session to delete.
 * @returns TypeORM's UpdateResult.
 */
export async function deleteSession(id: number) {
  return await connect().softDelete({ id })
}


function generateAttendanceCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789' // Excluded O, 0
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
  // In production, you might want to ensure uniqueness across active sessions,
  // potentially querying the DB and regenerating if a collision occurs.
}

export default {
  create,
  getSessionById,
  getSessionsByCourse,
  submitCode,
  deleteSession,
}