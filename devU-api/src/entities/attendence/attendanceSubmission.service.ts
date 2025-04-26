import { FindManyOptions } from 'typeorm'
import { dataSource } from '../../database'
import AttendanceSubmissionModel from './attendanceSubmission.model'
import attendanceService from './attendance.service'

interface AttendanceSubmissionCreateInput {
  attendanceSessionId: number;
  submissionUserId: number;
  submissionCode: string;
}

const connect = () => dataSource.getRepository(AttendanceSubmissionModel)

export async function getTotalSubmissionForSession(submissionUserId: number, attendanceSessionId: number) {
  return await connect().findAndCount({ where: { submissionUserId, attendanceSessionId } })
}

/**
 * Creates and saves a new attendance submission record.
 * @param submissionData - Data for the new submission.
 * @returns The saved submission model object and submission count excluding this one.
 * @throws if invalid attendance session or exceeds max submissions or exceeds deadline
 */
export async function create(submissionData: AttendanceSubmissionCreateInput): Promise<{
  submission: AttendanceSubmissionModel,
  triesLeft: number
}> {
  const { attendanceSessionId, submissionUserId, submissionCode } = submissionData

  const session = await attendanceService.getSessionById(attendanceSessionId)
  if (!session) {
    throw new Error('invalid attendance session')
  }

  const now = new Date(Date.now())
  if (now > session.expiresAt) {
    const err = JSON.stringify({
      reason: `submission deadline exceeded`,
      submittedAt: now.toISOString(),
      expireAt: session.createdAt.toISOString(),
    })
    throw new Error(err)
  }

  let [submissionList, count] = await getTotalSubmissionForSession(submissionUserId, attendanceSessionId)
  if (!submissionList) {
    throw new Error('invalid attendance session id')
  }
  count += 1

  if (count > session.maxTries) {
    const err = JSON.stringify({
      reason: `max submissions reached`,
      yourTries: count,
      maxTriesAllowed: session.maxTries,
    })
    throw new Error(err)
  }


  const submissionEntity = <AttendanceSubmissionModel>{
    submissionUserId: submissionUserId,
    isSuccessful: session.attendanceCode === submissionCode,
    submission: submissionCode,
    attendanceSessionId: attendanceSessionId,
  }
  const submission = await connect().save(submissionEntity)

  const triesLeft = session.maxTries - count
  return { submission, triesLeft }
}

/**
 * Retrieves all submission attempts by a specific user for a specific session.
 * @param submissionUserId - The ID of the student/user.
 * @param attendanceSessionId - The ID of the attendance session.
 * @param options - Optional TypeORM FindManyOptions.
 * @returns An array of submission model objects, ordered by submission time.
 */
export async function getSubmissionsByUserAndSession(
  submissionUserId: number,
  attendanceSessionId: number,
  options?: FindManyOptions<AttendanceSubmissionModel>,
): Promise<AttendanceSubmissionModel[]> {
  if (!submissionUserId || !attendanceSessionId) {
    console.warn('getSubmissionsByUserAndSession called with invalid IDs')
    return [] // Or throw error
  }
  return await connect().find({
    where: {
      submissionUserId,
      attendanceSessionId,
    },
    order: { submittedAt: 'ASC' },
    ...options,
  })
}


/**
 * Retrieves all submission attempts for a session.
 * @param attendanceSessionId - The ID of the attendance session.
 * @param options - Optional TypeORM FindManyOptions.
 * @returns An array of submission model objects, ordered by submission time.
 */
export async function getAllSubmissionsSessionId(
  attendanceSessionId: number,
  options?: FindManyOptions<AttendanceSubmissionModel>,
): Promise<AttendanceSubmissionModel[]> {
  return await connect().find({
    where: { attendanceSessionId },
    order: { submittedAt: 'ASC' },
    ...options,
  })
}


/**
 * Counts the number of submission attempts made by a specific user for a specific session.
 * This is still useful for checking against maxTries, even without storing attemptNumber.
 * @param submissionUserId - The ID of the student/user.
 * @param attendanceSessionId - The ID of the attendance session.
 * @returns The total number of attempts made.
 */
export async function countSubmissionsByUserAndSession(
  submissionUserId: number,
  attendanceSessionId: number,
): Promise<number> {
  if (!submissionUserId || !attendanceSessionId) {
    console.warn('countSubmissionsByUserAndSession called with invalid IDs')
    return 0 // Or throw error
  }
  return await connect().count({
    where: {
      submissionUserId,
      attendanceSessionId,
    },
  })
}

/**
 * Checks if a successful submission already exists for a given user and session.
 * @param submissionUserId - The ID of the student/user.
 * @param attendanceSessionId - The ID of the attendance session.
 * @returns True if a successful submission exists, false otherwise.
 */
export async function checkIfAlreadySuccessful(
  submissionUserId: number,
  attendanceSessionId: number,
): Promise<boolean> {
  if (!submissionUserId || !attendanceSessionId) {
    console.warn('checkIfAlreadySuccessful called with invalid IDs')
    return false // Or throw error
  }
  const successfulSubmissionCount = await connect().count({
    where: {
      submissionUserId,
      attendanceSessionId,
      isSuccessful: true, // Check specifically for successful submissions
    },
  })
  return successfulSubmissionCount > 0
}

// Export service functions
export default {
  create,
  getSubmissionsByUserAndSession,
  countSubmissionsByUserAndSession,
  checkIfAlreadySuccessful,
  getAllSubmissionsSessionId,
}